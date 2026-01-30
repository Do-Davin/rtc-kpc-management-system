import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual } from 'typeorm';
import { TeacherTodo } from './entities/teacher-todo.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TeacherDashboardService {
  constructor(
    @InjectRepository(TeacherTodo)
    private todoRepo: Repository<TeacherTodo>,
    @InjectRepository(AttendanceSession)
    private sessionRepo: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private recordRepo: Repository<AttendanceRecord>,
  ) {}

  // ========== Dashboard Statistics ==========

  /**
   * Get dashboard statistics for the authenticated teacher
   * - Present count today
   * - Absent count today
   * - Average attendance percentage over time range
   * - Course completion percentage
   */
  async getDashboardStats(teacherId: string, days: number = 30) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get today's sessions for this teacher
    const todaySessions = await this.sessionRepo.find({
      where: {
        teacherId,
        sessionDate: Between(today, todayEnd),
      },
      relations: ['attendanceRecords'],
    });

    // Calculate today's present/absent counts
    let presentToday = 0;
    let absentToday = 0;
    let lateToday = 0;

    todaySessions.forEach((session) => {
      session.attendanceRecords?.forEach((record) => {
        if (record.status === 'PRESENT' || record.status === 'MANUAL_PRESENT') {
          presentToday++;
        } else if (record.status === 'ABSENT') {
          absentToday++;
        } else if (record.status === 'LATE') {
          lateToday++;
        }
      });
    });

    // Calculate attendance percentage over time range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const allSessions = await this.sessionRepo.find({
      where: {
        teacherId,
        sessionDate: MoreThanOrEqual(startDate),
      },
      relations: ['attendanceRecords'],
    });

    let totalRecords = 0;
    let presentRecords = 0;

    allSessions.forEach((session) => {
      session.attendanceRecords?.forEach((record) => {
        totalRecords++;
        if (
          record.status === 'PRESENT' ||
          record.status === 'MANUAL_PRESENT' ||
          record.status === 'LATE'
        ) {
          presentRecords++;
        }
      });
    });

    const attendancePercentage =
      totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

    // Calculate course completion (completed sessions vs total planned)
    // For now, we'll consider STOPPED/EXPIRED sessions as completed
    const completedSessions = allSessions.filter(
      (s) => s.status === 'STOPPED' || s.status === 'EXPIRED',
    ).length;

    const totalSessions = allSessions.length;
    const courseCompletion =
      totalSessions > 0
        ? Math.round((completedSessions / totalSessions) * 100)
        : 0;

    return {
      presentToday,
      absentToday,
      lateToday,
      attendancePercentage,
      courseCompletion,
      totalSessionsToday: todaySessions.length,
      totalStudentsToday: presentToday + absentToday + lateToday,
    };
  }

  // ========== Attendance Trend Data ==========

  /**
   * Get attendance trend data for line chart
   * Aggregates attendance percentage by date
   */
  async getAttendanceTrend(teacherId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get all sessions in the date range
    const sessions = await this.sessionRepo.find({
      where: {
        teacherId,
        sessionDate: MoreThanOrEqual(startDate),
      },
      relations: ['attendanceRecords'],
      order: { sessionDate: 'ASC' },
    });

    // Group by date and calculate daily attendance percentages
    const dailyStats: Map<
      string,
      { present: number; absent: number; total: number }
    > = new Map();

    sessions.forEach((session) => {
      const dateKey = session.sessionDate.toISOString().split('T')[0];

      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, { present: 0, absent: 0, total: 0 });
      }

      const stats = dailyStats.get(dateKey)!;

      session.attendanceRecords?.forEach((record) => {
        stats.total++;
        if (
          record.status === 'PRESENT' ||
          record.status === 'MANUAL_PRESENT' ||
          record.status === 'LATE'
        ) {
          stats.present++;
        } else if (record.status === 'ABSENT') {
          stats.absent++;
        }
      });
    });

    // Convert to array for chart data
    const trendData: {
      date: string;
      percentage: number;
      present: number;
      absent: number;
      total: number;
    }[] = [];

    // Fill in all dates in range
    for (
      let d = new Date(startDate);
      d <= new Date();
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split('T')[0];
      const stats = dailyStats.get(dateKey);

      if (stats && stats.total > 0) {
        trendData.push({
          date: dateKey,
          percentage: Math.round((stats.present / stats.total) * 100),
          present: stats.present,
          absent: stats.absent,
          total: stats.total,
        });
      }
    }

    return trendData;
  }

  // ========== Today's Sessions ==========

  /**
   * Get today's teaching sessions for the teacher
   */
  async getTodaySessions(teacherId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const sessions = await this.sessionRepo.find({
      where: {
        teacherId,
        sessionDate: Between(today, todayEnd),
      },
      relations: ['attendanceRecords'],
      order: { sessionDate: 'ASC' },
    });

    return sessions.map((session) => {
      let presentCount = 0;
      let lateCount = 0;
      let absentCount = 0;

      session.attendanceRecords?.forEach((record) => {
        if (record.status === 'PRESENT' || record.status === 'MANUAL_PRESENT') {
          presentCount++;
        } else if (record.status === 'LATE') {
          lateCount++;
        } else if (record.status === 'ABSENT') {
          absentCount++;
        }
      });

      return {
        id: session.id,
        courseName: session.courseName,
        courseId: session.courseId,
        department: session.department,
        year: session.year,
        sessionName: session.sessionName,
        sessionDate: session.sessionDate,
        expiryTime: session.expiryTime,
        status: session.status,
        presentCount,
        lateCount,
        absentCount,
        totalStudents: presentCount + lateCount + absentCount,
      };
    });
  }

  // ========== Todo CRUD ==========

  /**
   * Get all todos for the teacher
   */
  async getTodos(teacherId: string) {
    return this.todoRepo.find({
      where: { teacherId },
      order: {
        isCompleted: 'ASC',
        dueDate: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Create a new todo
   */
  async createTodo(teacherId: string, dto: CreateTodoDto) {
    const todo = this.todoRepo.create({
      teacherId,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
      status: 'PENDING',
      isCompleted: false,
    });

    return this.todoRepo.save(todo);
  }

  /**
   * Update a todo
   */
  async updateTodo(teacherId: string, todoId: string, dto: UpdateTodoDto) {
    const todo = await this.todoRepo.findOneBy({ id: todoId });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own todos');
    }

    // Update fields
    if (dto.title !== undefined) todo.title = dto.title;
    if (dto.description !== undefined) todo.description = dto.description;
    if (dto.dueDate !== undefined)
      todo.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    if (dto.status !== undefined) todo.status = dto.status;
    if (dto.isCompleted !== undefined) {
      todo.isCompleted = dto.isCompleted;
      if (dto.isCompleted) {
        todo.status = 'COMPLETED';
      }
    }

    return this.todoRepo.save(todo);
  }

  /**
   * Toggle todo completion status
   */
  async toggleTodoComplete(teacherId: string, todoId: string) {
    const todo = await this.todoRepo.findOneBy({ id: todoId });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own todos');
    }

    todo.isCompleted = !todo.isCompleted;
    todo.status = todo.isCompleted ? 'COMPLETED' : 'PENDING';

    return this.todoRepo.save(todo);
  }

  /**
   * Delete a todo
   */
  async deleteTodo(teacherId: string, todoId: string) {
    const todo = await this.todoRepo.findOneBy({ id: todoId });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.teacherId !== teacherId) {
      throw new ForbiddenException('You can only delete your own todos');
    }

    await this.todoRepo.remove(todo);
    return { message: 'Todo deleted successfully' };
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThanOrEqual, DataSource } from 'typeorm';
import { TeacherTodo } from './entities/teacher-todo.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { Student, StudentStatus } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import {
  TeacherStudentQueryDto,
  AddStudentToClassDto,
  UpdateStudentByTeacherDto,
} from './dto/student-management.dto';

@Injectable()
export class TeacherDashboardService {
  constructor(
    @InjectRepository(TeacherTodo)
    private todoRepo: Repository<TeacherTodo>,
    @InjectRepository(AttendanceSession)
    private sessionRepo: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private recordRepo: Repository<AttendanceRecord>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Department)
    private deptRepo: Repository<Department>,
    private dataSource: DataSource,
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

  /**
   * Get attendance trend data for line chart
   * Shows CUMULATIVE attendance data that matches the stats cards
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

    // Group by date and calculate daily attendance
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

    // Convert to array for chart data - showing CUMULATIVE values
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

  // ========== Teacher Profile ==========

  /**
   * Get teacher profile by user ID
   */
  async getTeacherProfile(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    return {
      id: teacher.id,
      fullName: teacher.fullName,
      employeeId: teacher.employeeId,
      phoneNumber: teacher.phoneNumber,
      specialization: teacher.specialization,
      dateOfBirth: teacher.dateOfBirth,
      imageUrl: teacher.imageUrl,
      status: teacher.status,
      email: teacher.user?.email,
      department: teacher.department
        ? {
            id: teacher.department.id,
            name: teacher.department.name,
          }
        : null,
    };
  }

  /**
   * Update teacher profile
   */
  async updateTeacherProfile(userId: string, dto: UpdateTeacherProfileDto) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Update fields
    if (dto.fullName !== undefined) teacher.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) teacher.phoneNumber = dto.phoneNumber;
    if (dto.dateOfBirth !== undefined)
      teacher.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.imageUrl !== undefined) teacher.imageUrl = dto.imageUrl;

    await this.teacherRepo.save(teacher);

    return this.getTeacherProfile(userId);
  }

  // ========== Student Management ==========

  /**
   * Get students in teacher's department with filtering and pagination
   */
  async getStudentsInDepartment(userId: string, query: TeacherStudentQueryDto) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher || !teacher.department) {
      throw new NotFoundException('Teacher or department not found');
    }

    const { search, status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.department', 'department')
      .where('department.id = :deptId', { deptId: teacher.department.id });

    if (search) {
      queryBuilder.andWhere(
        '(student.fullName LIKE :search OR student.studentIdCard LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('student.status = :status', { status });
    }

    const [students, total] = await queryBuilder
      .orderBy('student.fullName', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      students: students.map((s) => ({
        id: s.id,
        studentIdCard: s.studentIdCard,
        fullName: s.fullName,
        year: s.year,
        enrollmentYear: s.enrollmentYear,
        phoneNumber: s.phoneNumber,
        status: s.status,
        email: s.user?.email,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single student details
   */
  async getStudentDetails(userId: string, studentId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher || !teacher.department) {
      throw new NotFoundException('Teacher or department not found');
    }

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['user', 'department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.department?.id !== teacher.department.id) {
      throw new ForbiddenException(
        'You can only view students in your department',
      );
    }

    return {
      id: student.id,
      studentIdCard: student.studentIdCard,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      year: student.year,
      enrollmentYear: student.enrollmentYear,
      phoneNumber: student.phoneNumber,
      imageUrl: student.imageUrl,
      status: student.status,
      email: student.user?.email,
      department: student.department
        ? {
            id: student.department.id,
            name: student.department.name,
          }
        : null,
    };
  }

  /**
   * Add a student to teacher's department
   */
  async addStudentToDepartment(userId: string, dto: AddStudentToClassDto) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher || !teacher.department) {
      throw new NotFoundException('Teacher or department not found');
    }

    // Generate student ID card
    const lastStudent = await this.studentRepo
      .createQueryBuilder('student')
      .orderBy('student.studentNumber', 'DESC')
      .getOne();

    const nextNumber = (lastStudent?.studentNumber || 0) + 1;
    const studentIdCard = `rtc${nextNumber.toString().padStart(5, '0')}`;

    // Create student
    const student = this.studentRepo.create({
      fullName: dto.fullName,
      studentIdCard,
      year: dto.year,
      enrollmentYear: dto.enrollmentYear,
      phoneNumber: dto.phoneNumber,
      status: dto.status || StudentStatus.ACTIVE,
      department: teacher.department,
    });

    await this.studentRepo.save(student);

    return this.getStudentDetails(userId, student.id);
  }

  /**
   * Update a student in teacher's department
   */
  async updateStudentInDepartment(
    userId: string,
    studentId: string,
    dto: UpdateStudentByTeacherDto,
  ) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher || !teacher.department) {
      throw new NotFoundException('Teacher or department not found');
    }

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.department?.id !== teacher.department.id) {
      throw new ForbiddenException(
        'You can only update students in your department',
      );
    }

    // Update fields
    if (dto.fullName !== undefined) student.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) student.phoneNumber = dto.phoneNumber;
    if (dto.year !== undefined) student.year = dto.year;
    if (dto.status !== undefined) student.status = dto.status;

    await this.studentRepo.save(student);

    return this.getStudentDetails(userId, studentId);
  }

  /**
   * Remove a student from teacher's department (soft delete - set to INACTIVE)
   */
  async removeStudentFromDepartment(userId: string, studentId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher || !teacher.department) {
      throw new NotFoundException('Teacher or department not found');
    }

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.department?.id !== teacher.department.id) {
      throw new ForbiddenException(
        'You can only remove students from your department',
      );
    }

    // Soft delete - set status to INACTIVE
    student.status = StudentStatus.INACTIVE;
    await this.studentRepo.save(student);

    return { message: 'Student removed from department successfully' };
  }
}

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
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
import {
  TeacherStudentQueryDto,
  AddStudentToClassDto,
  UpdateStudentByTeacherDto,
} from './dto/student-management.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import * as bcrypt from 'bcrypt';

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

    // Track cumulative values
    let cumulativePresent = 0;
    let cumulativeAbsent = 0;
    let cumulativeTotal = 0;

    // Fill in all dates in range
    for (
      let d = new Date(startDate);
      d <= new Date();
      d.setDate(d.getDate() + 1)
    ) {
      const dateKey = d.toISOString().split('T')[0];
      const stats = dailyStats.get(dateKey);

      // Add today's values to cumulative totals
      if (stats && stats.total > 0) {
        cumulativePresent += stats.present;
        cumulativeAbsent += stats.absent;
        cumulativeTotal += stats.total;
      }

      // Only add data point if we have any cumulative data
      if (cumulativeTotal > 0) {
        trendData.push({
          date: dateKey,
          percentage: Math.round((cumulativePresent / cumulativeTotal) * 100),
          present: cumulativePresent,
          absent: cumulativeAbsent,
          total: cumulativeTotal,
        });
      }
    }

    return trendData;
  }

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

  async updateTodo(teacherId: string, todoId: string, dto: UpdateTodoDto) {
    const todo = await this.todoRepo.findOneBy({ id: todoId });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    if (todo.teacherId !== teacherId) {
      throw new ForbiddenException('You can only update your own todos');
    }

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

  // ========== Teacher Profile Methods ==========

  /**
   * Get the logged-in teacher's profile
   */
  async getTeacherProfile(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Count students in department
    const studentCount = teacher.department
      ? await this.studentRepo.count({
          where: { department: { id: teacher.department.id } },
        })
      : 0;

    return {
      id: teacher.id,
      fullName: teacher.fullName,
      employeeId: teacher.employeeId,
      email: teacher.user?.email,
      phoneNumber: teacher.phoneNumber,
      specialization: teacher.specialization,
      dateOfBirth: teacher.dateOfBirth,
      imageUrl: teacher.imageUrl,
      status: teacher.status,
      department: teacher.department?.name,
      departmentId: teacher.department?.id,
      departmentCode: teacher.department?.code,
      studentCount,
      createdAt: teacher.createdAt,
    };
  }

  /**
   * Update the logged-in teacher's profile
   */
  async updateTeacherProfile(userId: string, dto: UpdateTeacherProfileDto) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Update allowed fields
    if (dto.fullName !== undefined) teacher.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) teacher.phoneNumber = dto.phoneNumber;
    if (dto.dateOfBirth !== undefined)
      teacher.dateOfBirth = new Date(dto.dateOfBirth);
    if (dto.imageUrl !== undefined) teacher.imageUrl = dto.imageUrl;

    const updatedTeacher = await this.teacherRepo.save(teacher);

    // Count students in department
    const studentCount = teacher.department
      ? await this.studentRepo.count({
          where: { department: { id: teacher.department.id } },
        })
      : 0;

    return {
      id: updatedTeacher.id,
      fullName: updatedTeacher.fullName,
      employeeId: updatedTeacher.employeeId,
      email: teacher.user?.email,
      phoneNumber: updatedTeacher.phoneNumber,
      specialization: updatedTeacher.specialization,
      dateOfBirth: updatedTeacher.dateOfBirth,
      imageUrl: updatedTeacher.imageUrl,
      status: updatedTeacher.status,
      department: teacher.department?.name,
      departmentId: teacher.department?.id,
      departmentCode: teacher.department?.code,
      studentCount,
      createdAt: updatedTeacher.createdAt,
    };
  }

  // ========== Student Management Methods ==========

  /**
   * Get the teacher's department
   */
  private async getTeacherDepartment(userId: string): Promise<Department> {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    if (!teacher.department) {
      throw new NotFoundException('Teacher is not assigned to any department');
    }

    return teacher.department;
  }

  /**
   * Get students in the teacher's department with filtering and pagination
   */
  async getStudentsInDepartment(userId: string, query: TeacherStudentQueryDto) {
    const department = await this.getTeacherDepartment(userId);

    const { search, status, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.studentRepo
      .createQueryBuilder('student')
      .leftJoinAndSelect('student.user', 'user')
      .leftJoinAndSelect('student.department', 'department')
      .where('department.id = :departmentId', { departmentId: department.id });

    if (search) {
      queryBuilder.andWhere(
        '(student.fullName ILIKE :search OR student.studentIdCard ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('student.status = :status', { status });
    }

    const [students, total] = await queryBuilder
      .orderBy('student.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    // Calculate attendance for each student
    const studentsWithAttendance = await Promise.all(
      students.map(async (student) => {
        const attendance = await this.calculateStudentAttendance(
          student.user?.id,
        );
        return {
          id: student.id,
          studentId: student.studentIdCard,
          studentNumber: student.studentNumber,
          fullName: student.fullName,
          email: student.user?.email,
          year: student.year,
          enrollmentYear: student.enrollmentYear,
          phoneNumber: student.phoneNumber,
          status: student.status,
          departmentName: student.department?.name,
          departmentCode: student.department?.code,
          attendance,
          classInfo: `Year ${student.year} / ${student.department?.name || 'N/A'}`,
          createdAt: student.createdAt,
        };
      }),
    );

    // Calculate statistics
    const allStudentsInDept = await this.studentRepo.count({
      where: { department: { id: department.id } },
    });

    const activeStudentsCount = await this.studentRepo.count({
      where: {
        department: { id: department.id },
        status: StudentStatus.ACTIVE,
      },
    });

    const inactiveStudentsCount = await this.studentRepo.count({
      where: {
        department: { id: department.id },
        status: StudentStatus.INACTIVE,
      },
    });

    // Calculate average attendance
    let totalAttendance = 0;
    studentsWithAttendance.forEach((s) => (totalAttendance += s.attendance));
    const averageAttendance =
      studentsWithAttendance.length > 0
        ? Math.round(totalAttendance / studentsWithAttendance.length)
        : 0;

    return {
      students: studentsWithAttendance,
      stats: {
        total: allStudentsInDept,
        active: activeStudentsCount,
        inactive: inactiveStudentsCount,
        averageAttendance,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Calculate attendance percentage for a student
   */
  private async calculateStudentAttendance(
    studentUserId: string,
  ): Promise<number> {
    if (!studentUserId) return 0;

    const records = await this.recordRepo.find({
      where: { studentId: studentUserId },
    });

    if (records.length === 0) return 0;

    const presentRecords = records.filter(
      (r) =>
        r.status === 'PRESENT' ||
        r.status === 'MANUAL_PRESENT' ||
        r.status === 'LATE',
    );

    return Math.round((presentRecords.length / records.length) * 100);
  }

  /**
   * Get a single student's details
   */
  async getStudentDetails(userId: string, studentId: string) {
    const department = await this.getTeacherDepartment(userId);

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['user', 'department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.department?.id !== department.id) {
      throw new ForbiddenException(
        'You can only view students in your department',
      );
    }

    const attendance = await this.calculateStudentAttendance(student.user?.id);

    return {
      id: student.id,
      studentId: student.studentIdCard,
      studentNumber: student.studentNumber,
      fullName: student.fullName,
      email: student.user?.email,
      year: student.year,
      enrollmentYear: student.enrollmentYear,
      phoneNumber: student.phoneNumber,
      status: student.status,
      departmentName: student.department?.name,
      departmentCode: student.department?.code,
      attendance,
      classInfo: `Year ${student.year} / ${student.department?.name || 'N/A'}`,
      createdAt: student.createdAt,
    };
  }

  /**
   * Generate email from fullName in format: name@rtc.com
   * Converts spaces to dots, removes special chars, makes lowercase
   */
  private generateEmailFromName(fullName: string): string {
    const emailName = fullName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '.') // Replace spaces with dots
      .replace(/[^a-z0-9.]/g, '') // Remove non-alphanumeric except dots
      .replace(/\.+/g, '.') // Replace multiple dots with single dot
      .replace(/^\.+|\.+$/g, ''); // Remove leading/trailing dots

    return `${emailName}@rtc.com`;
  }

  /**
   * Add a new student to the teacher's department
   */
  async addStudentToDepartment(userId: string, dto: AddStudentToClassDto) {
    const department = await this.getTeacherDepartment(userId);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate email from fullName
      let email = this.generateEmailFromName(dto.fullName);

      // Check for duplicate email and make unique if needed
      let existingUser = await this.userRepo.findOneBy({ email });
      let emailCounter = 1;
      while (existingUser) {
        const baseName = dto.fullName
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '.')
          .replace(/[^a-z0-9.]/g, '')
          .replace(/\.+/g, '.')
          .replace(/^\.+|\.+$/g, '');
        email = `${baseName}${emailCounter}@rtc.com`;
        existingUser = await this.userRepo.findOneBy({ email });
        emailCounter++;
      }

      // Create user account
      const plainPassword = 'RTC@2026';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const newUser = this.userRepo.create({
        email,
        password: hashedPassword,
        role: 'STUDENT',
      });
      const savedUser = await queryRunner.manager.save(newUser);

      // Create student record - studentNumber will be auto-generated
      // We'll set studentIdCard after getting the studentNumber
      const newStudent = this.studentRepo.create({
        fullName: dto.fullName,
        studentIdCard: 'temp', // Will be updated after save
        year: dto.year,
        enrollmentYear: dto.enrollmentYear,
        phoneNumber: dto.phoneNumber,
        user: savedUser,
        department: department,
        status: dto.status || StudentStatus.ACTIVE,
      });

      const savedStudent = await queryRunner.manager.save(newStudent);

      // Update studentIdCard with auto-generated format: rtc[studentNumber]
      savedStudent.studentIdCard = `rtc${savedStudent.studentNumber}`;
      await queryRunner.manager.save(savedStudent);

      await queryRunner.commitTransaction();

      return {
        id: savedStudent.id,
        studentId: savedStudent.studentIdCard,
        studentNumber: savedStudent.studentNumber,
        fullName: savedStudent.fullName,
        email: savedUser.email,
        year: savedStudent.year,
        enrollmentYear: savedStudent.enrollmentYear,
        phoneNumber: savedStudent.phoneNumber,
        status: savedStudent.status,
        departmentName: department.name,
        departmentCode: department.code,
        attendance: 0,
        classInfo: `Year ${savedStudent.year} / ${department.name}`,
        createdAt: savedStudent.createdAt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const err = error as { code?: string };
      if (err.code === '23505') {
        throw new ConflictException('Email or Student ID already exists');
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Update a student in the teacher's department
   */
  async updateStudentInDepartment(
    userId: string,
    studentId: string,
    dto: UpdateStudentByTeacherDto,
  ) {
    const department = await this.getTeacherDepartment(userId);

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['user', 'department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.department?.id !== department.id) {
      throw new ForbiddenException(
        'You can only update students in your department',
      );
    }

    // Update allowed fields
    if (dto.fullName !== undefined) student.fullName = dto.fullName;
    if (dto.phoneNumber !== undefined) student.phoneNumber = dto.phoneNumber;
    if (dto.year !== undefined) student.year = dto.year;
    if (dto.status !== undefined) student.status = dto.status;

    const updatedStudent = await this.studentRepo.save(student);
    const attendance = await this.calculateStudentAttendance(student.user?.id);

    return {
      id: updatedStudent.id,
      studentId: updatedStudent.studentIdCard,
      fullName: updatedStudent.fullName,
      email: student.user?.email,
      year: updatedStudent.year,
      enrollmentYear: updatedStudent.enrollmentYear,
      phoneNumber: updatedStudent.phoneNumber,
      status: updatedStudent.status,
      departmentName: department.name,
      departmentCode: department.code,
      attendance,
      classInfo: `Year ${updatedStudent.year} / ${department.name}`,
      createdAt: updatedStudent.createdAt,
    };
  }

  /**
   * Remove a student from the teacher's department (soft delete - set to INACTIVE)
   */
  async removeStudentFromDepartment(userId: string, studentId: string) {
    const department = await this.getTeacherDepartment(userId);

    const student = await this.studentRepo.findOne({
      where: { id: studentId },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (student.department?.id !== department.id) {
      throw new ForbiddenException(
        'You can only remove students in your department',
      );
    }

    // Soft delete - set status to INACTIVE
    student.status = StudentStatus.INACTIVE;
    await this.studentRepo.save(student);

    return { message: 'Student removed successfully' };
  }
}

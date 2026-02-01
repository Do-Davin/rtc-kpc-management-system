import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Course } from '../admin-courses/entity/course.entity';

@Injectable()
export class StudentDashboardService {
  constructor(
    @InjectRepository(AttendanceSession)
    private sessionRepo: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private recordRepo: Repository<AttendanceRecord>,
    @InjectRepository(Student)
    private studentRepo: Repository<Student>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Schedule)
    private scheduleRepo: Repository<Schedule>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
  ) {}

  /**
   * Get the student profile by userId
   */
  async getStudentProfile(userId: string) {
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department'],
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return {
      id: student.id,
      fullName: student.fullName,
      studentIdCard: student.studentIdCard,
      year: student.year,
      enrollmentYear: student.enrollmentYear,
      phoneNumber: student.phoneNumber,
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
   * Get dashboard statistics for the authenticated student
   * Tracks by courses/sessions (each course is 2 hours, timeline 7:00-17:00)
   * - Present courses count (marked by teacher or QR)
   * - Late courses count
   * - Absent courses count
   * - Average attendance percentage
   */
  async getDashboardStats(userId: string, days: number = 30) {
    // Use the same method as getAttendanceTrend to ensure consistency
    const trendData = await this.getAttendanceTrend(userId, days);
    
    // Get the final cumulative values from the last data point
    if (trendData.length === 0) {
      return {
        presentCourses: 0,
        lateCourses: 0,
        absentCourses: 0,
        attendanceRate: 0,
        totalCourses: 0,
      };
    }
    
    const lastDataPoint = trendData[trendData.length - 1];
    
    return {
      presentCourses: lastDataPoint.present,
      lateCourses: lastDataPoint.late,
      absentCourses: lastDataPoint.absent,
      attendanceRate: lastDataPoint.percentage,
      totalCourses: lastDataPoint.total,
    };
  }

  /**
   * Get attendance trend data for line chart
   * Shows CUMULATIVE attendance data that matches the stats cards exactly
   * The last data point will have the same values as getDashboardStats
   */
  async getAttendanceTrend(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    // Get all attendance records for this student within date range
    const records = await this.recordRepo
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.session', 'session')
      .where('record.studentId = :userId', { userId })
      .andWhere('session.sessionDate >= :startDate', { startDate })
      .andWhere('session.sessionDate <= :endDate', { endDate })
      .orderBy('session.sessionDate', 'ASC')
      .getMany();

    // Group by date and count courses per day
    const dailyStats: Map<
      string,
      { present: number; absent: number; late: number; total: number }
    > = new Map();

    records.forEach((record) => {
      const dateKey = record.session?.sessionDate
        ? new Date(record.session.sessionDate).toISOString().split('T')[0]
        : new Date(record.createdAt).toISOString().split('T')[0];

      if (!dailyStats.has(dateKey)) {
        dailyStats.set(dateKey, { present: 0, absent: 0, late: 0, total: 0 });
      }

      const stats = dailyStats.get(dateKey)!;
      stats.total++;

      if (record.status === 'PRESENT' || record.status === 'MANUAL_PRESENT') {
        stats.present++;
      } else if (record.status === 'LATE') {
        stats.late++;
      } else if (record.status === 'ABSENT') {
        stats.absent++;
      }
    });

    // Convert to array for chart data - showing CUMULATIVE courses
    const trendData: {
      date: string;
      percentage: number;
      present: number;
      absent: number;
      late: number;
      total: number;
      coursesAttended: number;
      presentPercent: number;
      absentPercent: number;
      latePercent: number;
    }[] = [];

    // Track cumulative values
    let cumulativePresent = 0;
    let cumulativeAbsent = 0;
    let cumulativeLate = 0;
    let cumulativeTotal = 0;

    // Get sorted dates from the map
    const sortedDates = Array.from(dailyStats.keys()).sort();

    // Only include dates that have data
    for (const dateKey of sortedDates) {
      const stats = dailyStats.get(dateKey)!;

      // Add today's values to cumulative totals
      cumulativePresent += stats.present;
      cumulativeAbsent += stats.absent;
      cumulativeLate += stats.late;
      cumulativeTotal += stats.total;

      // Calculate cumulative attendance percentage: (present + late) / total
      const attended = cumulativePresent + cumulativeLate;
      const percentage =
        cumulativeTotal > 0
          ? Math.round((attended / cumulativeTotal) * 100)
          : 0;

      // Calculate individual percentages for chart display
      const presentPercent =
        cumulativeTotal > 0
          ? Math.round((cumulativePresent / cumulativeTotal) * 100)
          : 0;
      const absentPercent =
        cumulativeTotal > 0
          ? Math.round((cumulativeAbsent / cumulativeTotal) * 100)
          : 0;
      const latePercent =
        cumulativeTotal > 0
          ? Math.round((cumulativeLate / cumulativeTotal) * 100)
          : 0;

      trendData.push({
        date: dateKey,
        percentage,
        present: cumulativePresent,
        absent: cumulativeAbsent,
        late: cumulativeLate,
        total: cumulativeTotal,
        coursesAttended: attended,
        presentPercent,
        absentPercent,
        latePercent,
      });
    }

    return trendData;
  }

  /**
   * Get today's classes for the student based on their department and year
   */
  async getTodayClasses(userId: string) {
    // First get the student to know their department and year
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Get today's day name (e.g., "Monday", "Tuesday")
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const today = new Date();
    const todayDayName = daysOfWeek[today.getDay()];

    // Convert student year (integer) to schedule year format (e.g., 1 -> "Year 1")
    const studentYearFormatted = `Year ${student.year}`;

    // Find schedules for this student's department, year, and today's day
    const schedules = await this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .leftJoinAndSelect('schedule.department', 'department')
      .where('department.id = :departmentId', {
        departmentId: student.department?.id,
      })
      .andWhere('schedule.year = :year', { year: studentYearFormatted })
      .andWhere('schedule.day = :day', { day: todayDayName })
      .orderBy('schedule.startTime', 'ASC')
      .getMany();

    return schedules.map((schedule) => ({
      id: schedule.id,
      courseName: schedule.subjectName,
      teacherName: schedule.teacher?.fullName || 'គ្រូ',
      room: schedule.room || 'បន្ទប់',
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      type: schedule.type,
      group: schedule.group,
      color: schedule.color,
      day: schedule.day,
    }));
  }

  /**
   * Get all schedules for the student based on their department and year (for timetable view)
   */
  async getMySchedule(userId: string) {
    // First get the student to know their department and year
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    // Convert student year (integer) to schedule year format (e.g., 1 -> "Year 1")
    const studentYearFormatted = `Year ${student.year}`;

    // Find all schedules for this student's department and year
    const schedules = await this.scheduleRepo
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.teacher', 'teacher')
      .leftJoinAndSelect('teacher.user', 'teacherUser')
      .leftJoinAndSelect('schedule.department', 'department')
      .where('department.id = :departmentId', {
        departmentId: student.department?.id,
      })
      .andWhere('schedule.year = :year', { year: studentYearFormatted })
      .orderBy('schedule.day', 'ASC')
      .addOrderBy('schedule.startTime', 'ASC')
      .getMany();

    return {
      student: {
        department: student.department?.name || 'N/A',
        departmentCode: student.department?.code || 'N/A',
        year: student.year,
        // Note: Student entity doesn't have a group field, default to 'A'
        group: 'A',
      },
      schedules: schedules.map((schedule) => ({
        id: schedule.id,
        subjectName: schedule.subjectName,
        teacherName: schedule.teacher?.fullName || 'គ្រូ',
        room: schedule.room || 'បន្ទប់',
        day: schedule.day,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        type: schedule.type,
        group: schedule.group,
        color: schedule.color || '#5B55F3',
      })),
    };
  }

  /**
   * Get courses for the authenticated student
   * Filters by: student.departmentId === course.departmentId
   * Only returns active courses (status = true)
   */
  async getMyCourses(userId: string) {
    // Step 1: Get student with department relation
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    if (!student.department) {
      throw new NotFoundException('Student department not assigned');
    }

    // Step 2: Fetch courses where departmentId matches student's department
    // Only return active courses (status = true)
    const courses = await this.courseRepo.find({
      where: {
        departmentId: student.department.id,
        status: true,
      },
      relations: ['department'],
      order: {
        year: 'ASC',
        title: 'ASC',
      },
    });

    // Step 3: Return formatted response
    return {
      student: {
        id: student.id,
        fullName: student.fullName,
        year: student.year,
        department: {
          id: student.department.id,
          name: student.department.name,
          code: student.department.code,
        },
      },
      courses: courses.map((course) => ({
        id: course.id,
        title: course.title,
        subtitle: course.subtitle,
        courseCode: course.courseCode,
        image: course.image,
        year: course.year,
        professorName: course.professorName,
        department: course.department
          ? {
              id: course.department.id,
              name: course.department.name,
            }
          : null,
        // Progress tracking
        progress1: course.progress1,
        progress2: course.progress2,
        progress3: course.progress3,
      })),
      total: courses.length,
    };
  }

  /**
   * Get a specific course by ID
   * Validates that the course belongs to student's department
   */
  async getCourseById(userId: string, courseId: string) {
    // Step 1: Get student with department
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    if (!student.department) {
      throw new NotFoundException('Student department not assigned');
    }

    // Step 2: Get course with department relation
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['department'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Step 3: Validate course belongs to student's department
    if (course.departmentId !== student.department.id) {
      throw new NotFoundException('Course not found in your department');
    }

    // Step 4: Return course details
    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      courseCode: course.courseCode,
      image: course.image,
      year: course.year,
      professorName: course.professorName,
      status: course.status,
      department: course.department
        ? {
            id: course.department.id,
            name: course.department.name,
          }
        : null,
      progress1: course.progress1,
      progress2: course.progress2,
      progress3: course.progress3,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}

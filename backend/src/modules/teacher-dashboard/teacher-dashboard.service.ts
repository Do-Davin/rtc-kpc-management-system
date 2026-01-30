import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';

@Injectable()
export class TeacherDashboardService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(AttendanceSession)
    private sessionRepository: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private recordRepository: Repository<AttendanceRecord>,
  ) {}

  async getDashboardStats() {
    // Get total students
    const totalStudents = await this.studentRepository.count();

    // Get total teachers
    const totalTeachers = await this.teacherRepository.count();

    // Get total unique courses from attendance sessions
    const uniqueCourses = await this.sessionRepository
      .createQueryBuilder('session')
      .select('DISTINCT session.courseId')
      .getRawMany();
    const totalCourses = uniqueCourses.length;

    // Calculate average attendance percentage
    const totalSessions = await this.sessionRepository.count();
    let averageAttendance = 0;

    if (totalSessions > 0) {
      // Get all sessions with their attendance records
      const sessionsWithRecords = await this.sessionRepository.find({
        relations: ['attendanceRecords'],
      });

      let totalAttendanceRate = 0;
      let sessionsWithAttendance = 0;

      for (const session of sessionsWithRecords) {
        if (session.attendanceRecords && session.attendanceRecords.length > 0) {
          // Count present students (PRESENT or MANUAL_PRESENT)
          const presentCount = session.attendanceRecords.filter(
            (record) =>
              record.status === 'PRESENT' || record.status === 'MANUAL_PRESENT',
          ).length;

          const totalRecords = session.attendanceRecords.length;
          const sessionRate = (presentCount / totalRecords) * 100;
          totalAttendanceRate += sessionRate;
          sessionsWithAttendance++;
        }
      }

      if (sessionsWithAttendance > 0) {
        averageAttendance = Math.round(
          totalAttendanceRate / sessionsWithAttendance,
        );
      }
    }

    return {
      totalStudents,
      totalTeachers,
      totalCourses,
      averageAttendance,
    };
  }
}

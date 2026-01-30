import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherDashboardController } from './teacher-dashboard.controller';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Teacher,
      AttendanceSession,
      AttendanceRecord,
    ]),
  ],
  controllers: [TeacherDashboardController],
  providers: [TeacherDashboardService],
  exports: [TeacherDashboardService],
})
export class TeacherDashboardModule {}

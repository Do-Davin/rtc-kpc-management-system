import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentDashboardService } from './student-dashboard.service';
import { StudentDashboardController } from './student-dashboard.controller';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Schedule } from '../schedules/entities/schedule.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceSession,
      AttendanceRecord,
      Student,
      User,
      Schedule,
    ]),
  ],
  providers: [StudentDashboardService],
  controllers: [StudentDashboardController],
  exports: [StudentDashboardService],
})
export class StudentDashboardModule {}

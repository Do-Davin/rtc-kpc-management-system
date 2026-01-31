import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { TeacherDashboardController } from './teacher-dashboard.controller';
import { TeacherTodo } from './entities/teacher-todo.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { Student } from '../students/entities/student.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherTodo,
      AttendanceSession,
      AttendanceRecord,
      Student,
      Teacher,
      User,
      Department,
    ]),
  ],
  providers: [TeacherDashboardService],
  controllers: [TeacherDashboardController],
  exports: [TeacherDashboardService],
})
export class TeacherDashboardModule {}

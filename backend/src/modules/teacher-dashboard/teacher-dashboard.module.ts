import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { TeacherDashboardController } from './teacher-dashboard.controller';
import { TeacherTodo } from './entities/teacher-todo.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherTodo,
      AttendanceSession,
      AttendanceRecord,
    ]),
  ],
  providers: [TeacherDashboardService],
  controllers: [TeacherDashboardController],
  exports: [TeacherDashboardService],
})
export class TeacherDashboardModule {}

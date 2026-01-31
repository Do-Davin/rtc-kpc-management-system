import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { ConfigModule } from '@nestjs/config';
import { DepartmentsModule } from './modules/departments/departments.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { TeacherDashboardModule } from './modules/teacher-dashboard/teacher-dashboard.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ElibraryModule } from './modules/elibrary/elibrary.module';
import { SchedulesModule } from './modules/schedules/schedules.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    DepartmentsModule,
    StudentsModule,
    TeachersModule,
    AttendanceModule,
    TeacherDashboardModule,
    CoursesModule,
    ElibraryModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

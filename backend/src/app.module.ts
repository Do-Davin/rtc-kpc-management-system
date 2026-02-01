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
import { AdminCoursesModule } from './modules/admin-courses/admin-courses.module';
import { TeacherCoursesModule } from './modules/teacher-courses/teacher-courses.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { ELibraryModule } from './modules/elibrary/elibrary.module';

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
    AdminCoursesModule, // Admin can CREATE/UPDATE/DELETE courses for departments
    TeacherCoursesModule, // Teacher can only VIEW courses from their department
    ELibraryModule,
    SchedulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

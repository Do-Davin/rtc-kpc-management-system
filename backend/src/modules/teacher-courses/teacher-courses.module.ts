import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherCoursesController } from './teacher-courses.controller';
import { TeacherCoursesService } from './teacher-courses.service';
import { Course } from '../admin-courses/entity/course.entity';
import { Teacher } from '../teachers/entities/teacher.entity';

/**
 * Teacher Courses Module
 * This module handles teacher-specific course viewing.
 * Teachers can only VIEW courses from their department.
 * Course creation/update/delete is handled by Admin in the 'admin-courses' module.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Course, Teacher])],
  controllers: [TeacherCoursesController],
  providers: [TeacherCoursesService],
  exports: [TeacherCoursesService],
})
export class TeacherCoursesModule {}

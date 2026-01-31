import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCoursesService } from './admin-courses.service';
import { AdminCoursesController } from './admin-courses.controller';
import { Course } from './entity/course.entity';
import { Department } from '../departments/entities/department.entity';

/**
 * Admin Courses Module
 * This module handles course CRUD operations for administrators.
 * Admins can create, update, and delete courses.
 * Courses are linked to departments.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Course, Department])],
  controllers: [AdminCoursesController],
  providers: [AdminCoursesService],
  exports: [AdminCoursesService],
})
export class AdminCoursesModule {}

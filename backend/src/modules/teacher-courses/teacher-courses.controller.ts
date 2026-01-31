import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TeacherCoursesService } from './teacher-courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UpdateProgressDto } from './dto/update-progress.dto';
import type { AuthRequest } from '../common/types/auth-request.type';

/**
 * Teacher Courses Controller
 * Teachers can only VIEW courses from their department.
 * Course creation/update/delete is handled by Admin in the 'admin-courses' module.
 */
@Controller('teacher-courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherCoursesController {
  constructor(private readonly teacherCoursesService: TeacherCoursesService) {}

  /**
   * Get all courses for the logged-in teacher's department
   * GET /teacher-courses
   */
  @Roles('TEACHER')
  @Get()
  async findAll(@Request() req: AuthRequest) {
    const courses = await this.teacherCoursesService.findAllByTeacherDepartment(
      req.user.sub,
    );
    return { courses };
  }

  /**
   * Get active courses for the logged-in teacher's department
   * GET /teacher-courses/active
   */
  @Roles('TEACHER')
  @Get('active')
  async findActive(@Request() req: AuthRequest) {
    const courses =
      await this.teacherCoursesService.findActiveByTeacherDepartment(
        req.user.sub,
      );
    return { courses };
  }

  /**
   * Get course statistics for the logged-in teacher's department
   * GET /teacher-courses/stats
   */
  @Roles('TEACHER')
  @Get('stats')
  async getStats(@Request() req: AuthRequest) {
    const stats = await this.teacherCoursesService.getStats(req.user.sub);
    return { stats };
  }

  /**
   * Get a single course by ID
   * GET /teacher-courses/:id
   */
  @Roles('TEACHER')
  @Get(':id')
  async findOne(@Request() req: AuthRequest, @Param('id') courseId: string) {
    const course = await this.teacherCoursesService.findOne(
      req.user.sub,
      courseId,
    );
    return { course };
  }

  /**
   * Update course progress checkmarks
   * PATCH /teacher-courses/:id/progress
   */
  @Roles('TEACHER')
  @Patch(':id/progress')
  async updateProgress(
    @Request() req: AuthRequest,
    @Param('id') courseId: string,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    const result = await this.teacherCoursesService.updateProgress(
      req.user.sub,
      courseId,
      updateProgressDto,
    );
    return result;
  }
}

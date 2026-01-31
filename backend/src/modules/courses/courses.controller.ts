import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import type { AuthRequest } from '../common/types/auth-request.type';

@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  /**
   * Get all courses for the logged-in teacher
   * GET /courses
   */
  @Roles('TEACHER')
  @Get()
  async findAll(@Request() req: AuthRequest) {
    const courses = await this.coursesService.findAllByTeacher(req.user.sub);
    return { courses };
  }

  /**
   * Get course statistics
   * GET /courses/stats
   */
  @Roles('TEACHER')
  @Get('stats')
  async getStats(@Request() req: AuthRequest) {
    const stats = await this.coursesService.getStats(req.user.sub);
    return { stats };
  }

  /**
   * Create a new course
   * POST /courses
   */
  @Roles('TEACHER')
  @Post()
  async create(@Request() req: AuthRequest, @Body() dto: CreateCourseDto) {
    const course = await this.coursesService.create(req.user.sub, dto);
    return { course };
  }

  /**
   * Update a course
   * PUT /courses/:id
   */
  @Roles('TEACHER')
  @Put(':id')
  async update(
    @Request() req: AuthRequest,
    @Param('id') courseId: string,
    @Body() dto: UpdateCourseDto,
  ) {
    const course = await this.coursesService.update(
      req.user.sub,
      courseId,
      dto,
    );
    return { course };
  }

  /**
   * Delete a course
   * DELETE /courses/:id
   */
  @Roles('TEACHER')
  @Delete(':id')
  async remove(@Request() req: AuthRequest, @Param('id') courseId: string) {
    return this.coursesService.remove(req.user.sub, courseId);
  }
}

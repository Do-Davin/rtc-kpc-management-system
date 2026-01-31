import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { DashboardQueryDto, TrendQueryDto } from './dto/dashboard-query.dto';
import {
  TeacherStudentQueryDto,
  AddStudentToClassDto,
  UpdateStudentByTeacherDto,
} from './dto/student-management.dto';
import { UpdateTeacherProfileDto } from './dto/update-teacher-profile.dto';
import type { AuthRequest } from '../common/types/auth-request.type';

@Controller('teacher-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherDashboardController {
  constructor(private readonly dashboardService: TeacherDashboardService) {}

  // ========== Teacher Profile ==========

  /**
   * Get the logged-in teacher's profile
   * GET /teacher-dashboard/profile
   */
  @Get('profile')
  async getProfile(@Request() req: AuthRequest) {
    const profile = await this.dashboardService.getTeacherProfile(req.user.sub);
    return { profile };
  }

  /**
   * Update the logged-in teacher's profile
   * PUT /teacher-dashboard/profile
   */
  @Put('profile')
  async updateProfile(
    @Request() req: AuthRequest,
    @Body() dto: UpdateTeacherProfileDto,
  ) {
    const profile = await this.dashboardService.updateTeacherProfile(
      req.user.sub,
      dto,
    );
    return { profile };
  }

  // ========== Dashboard Statistics ==========

  /**
   * Get dashboard statistics for the logged-in teacher
   * GET /teacher-dashboard/stats?days=30 សម្រាប់សាកក្នុង Postman
   */
  @Get('stats')
  async getDashboardStats(
    @Request() req: AuthRequest,
    @Query() query: DashboardQueryDto,
  ) {
    const stats = await this.dashboardService.getDashboardStats(
      req.user.sub,
      query.days,
    );
    return { stats };
  }

  // ========== Attendance Trend ==========
  // កន្លែងនេះពិបាកមើល business Logic
  /**
   * Get attendance trend data for chart
   * GET /teacher-dashboard/attendance-trend?days=30
   */
  @Get('attendance-trend')
  async getAttendanceTrend(
    @Request() req: AuthRequest,
    @Query() query: TrendQueryDto,
  ) {
    const trend = await this.dashboardService.getAttendanceTrend(
      req.user.sub,
      query.days,
    );
    return { trend };
  }

  // ========== Today's Sessions ==========

  /**
   * Get today's teaching sessions
   * GET /teacher-dashboard/today-sessions
   */
  @Get('today-sessions')
  async getTodaySessions(@Request() req: AuthRequest) {
    const sessions = await this.dashboardService.getTodaySessions(req.user.sub);
    return { sessions };
  }

  // ========== Todo CRUD ==========

  @Get('todos')
  async getTodos(@Request() req: AuthRequest) {
    const todos = await this.dashboardService.getTodos(req.user.sub);
    return { todos };
  }

  @Post('todos')
  async createTodo(@Request() req: AuthRequest, @Body() dto: CreateTodoDto) {
    const todo = await this.dashboardService.createTodo(req.user.sub, dto);
    return { todo };
  }

  @Put('todos/:id')
  async updateTodo(
    @Request() req: AuthRequest,
    @Param('id') todoId: string,
    @Body() dto: UpdateTodoDto,
  ) {
    const todo = await this.dashboardService.updateTodo(
      req.user.sub,
      todoId,
      dto,
    );
    return { todo };
  }

  @Patch('todos/:id/toggle')
  async toggleTodoComplete(
    @Request() req: AuthRequest,
    @Param('id') todoId: string,
  ) {
    const todo = await this.dashboardService.toggleTodoComplete(
      req.user.sub,
      todoId,
    );
    return { todo };
  }

  @Delete('todos/:id')
  async deleteTodo(@Request() req: AuthRequest, @Param('id') todoId: string) {
    return this.dashboardService.deleteTodo(req.user.sub, todoId);
  }

  // ========== Student Management ==========

  /**
   * Get students in teacher's department with filtering
   * GET /teacher-dashboard/students?search=&status=ACTIVE&page=1&limit=50
   */
  @Get('students')
  async getStudents(
    @Request() req: AuthRequest,
    @Query() query: TeacherStudentQueryDto,
  ) {
    return this.dashboardService.getStudentsInDepartment(req.user.sub, query);
  }

  /**
   * Get a single student's details
   * GET /teacher-dashboard/students/:id
   */
  @Get('students/:id')
  async getStudentDetails(
    @Request() req: AuthRequest,
    @Param('id') studentId: string,
  ) {
    const student = await this.dashboardService.getStudentDetails(
      req.user.sub,
      studentId,
    );
    return { student };
  }

  /**
   * Add a new student to teacher's department
   * POST /teacher-dashboard/students
   */
  @Post('students')
  async addStudent(
    @Request() req: AuthRequest,
    @Body() dto: AddStudentToClassDto,
  ) {
    const student = await this.dashboardService.addStudentToDepartment(
      req.user.sub,
      dto,
    );
    return { student };
  }

  /**
   * Update a student in teacher's department
   * PUT /teacher-dashboard/students/:id
   */
  @Put('students/:id')
  async updateStudent(
    @Request() req: AuthRequest,
    @Param('id') studentId: string,
    @Body() dto: UpdateStudentByTeacherDto,
  ) {
    const student = await this.dashboardService.updateStudentInDepartment(
      req.user.sub,
      studentId,
      dto,
    );
    return { student };
  }

  /**
   * Remove a student from teacher's department (soft delete)
   * DELETE /teacher-dashboard/students/:id
   */
  @Delete('students/:id')
  async removeStudent(
    @Request() req: AuthRequest,
    @Param('id') studentId: string,
  ) {
    return this.dashboardService.removeStudentFromDepartment(
      req.user.sub,
      studentId,
    );
  }
}

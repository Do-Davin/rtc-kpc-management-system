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
import type { AuthRequest } from '../common/types/auth-request.type';

@Controller('teacher-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('TEACHER')
export class TeacherDashboardController {
  constructor(private readonly dashboardService: TeacherDashboardService) {}

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

  /**
   * Get all todos for the teacher
   * GET /teacher-dashboard/todos
   */
  @Get('todos')
  async getTodos(@Request() req: AuthRequest) {
    const todos = await this.dashboardService.getTodos(req.user.sub);
    return { todos };
  }

  /**
   * Create a new todo
   * POST /teacher-dashboard/todos
   */
  @Post('todos')
  async createTodo(@Request() req: AuthRequest, @Body() dto: CreateTodoDto) {
    const todo = await this.dashboardService.createTodo(req.user.sub, dto);
    return { todo };
  }

  /**
   * Update a todo
   * PUT /teacher-dashboard/todos/:id
   */
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

  /**
   * Toggle todo completion status
   * PATCH /teacher-dashboard/todos/:id/toggle
   */
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

  /**
   * Delete a todo
   * DELETE /teacher-dashboard/todos/:id
   */
  @Delete('todos/:id')
  async deleteTodo(@Request() req: AuthRequest, @Param('id') todoId: string) {
    return this.dashboardService.deleteTodo(req.user.sub, todoId);
  }
}

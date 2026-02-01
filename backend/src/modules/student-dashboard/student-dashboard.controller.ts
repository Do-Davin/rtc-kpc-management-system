import {
  Controller,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StudentDashboardService } from './student-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { DashboardQueryDto, TrendQueryDto } from './dto/dashboard-query.dto';
import type { AuthRequest } from '../common/types/auth-request.type';

@Controller('student-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('STUDENT')
export class StudentDashboardController {
  constructor(private readonly dashboardService: StudentDashboardService) {}

  // ========== Student Profile ==========

  /**
   * Get the logged-in student's profile
   * GET /student-dashboard/profile
   */
  @Get('profile')
  async getProfile(@Request() req: AuthRequest) {
    const profile = await this.dashboardService.getStudentProfile(req.user.sub);
    return { profile };
  }

  // ========== Dashboard Statistics ==========

  /**
   * Get dashboard statistics for the logged-in student
   * GET /student-dashboard/stats?days=30
   * 
   * Returns:
   * - presentDays: Number of days student was marked present (by teacher or QR)
   * - lateDays: Number of days student was marked late
   * - absentDays: Number of days student was marked absent
   * - attendanceRate: Average attendance percentage
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

  /**
   * Get attendance trend data for chart
   * GET /student-dashboard/attendance-trend?days=30
   * 
   * Returns array of daily attendance data for the student
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

  // ========== Today's Classes ==========

  /**
   * Get today's scheduled classes for the student
   * GET /student-dashboard/today-classes
   */
  @Get('today-classes')
  async getTodayClasses(@Request() req: AuthRequest) {
    const classes = await this.dashboardService.getTodayClasses(req.user.sub);
    return { classes };
  }

  // ========== Student's Full Schedule/Timetable ==========

  /**
   * Get all schedules for the student (for timetable view)
   * GET /student-dashboard/my-schedule
   */
  @Get('my-schedule')
  async getMySchedule(@Request() req: AuthRequest) {
    return this.dashboardService.getMySchedule(req.user.sub);
  }
}

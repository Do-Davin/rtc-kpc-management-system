import { Controller, Get, UseGuards } from '@nestjs/common';
import { TeacherDashboardService } from './teacher-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('teacher-dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherDashboardController {
  constructor(private readonly dashboardService: TeacherDashboardService) {}

  /**
   * Get dashboard statistics for teacher
   * GET /teacher-dashboard/stats
   */
  @Get('stats')
  @Roles('TEACHER', 'ADMIN')
  async getDashboardStats() {
    return this.dashboardService.getDashboardStats();
  }
}

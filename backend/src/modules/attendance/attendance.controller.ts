import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GenerateQrDto } from './dto/generate-qr.dto';
import { StopSessionDto } from './dto/stop-session.dto';
import { ManualAttendanceDto } from './dto/manual-attendance.dto';
import { SubmitAttendanceDto } from './dto/submit-attendance.dto';
import type { AuthRequest } from '../common/types/auth-request.type';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // ========== Teacher Endpoints ==========

  /**
   * Generate a new QR code for attendance session
   * POST /attendance/generate-qr [Test នៅ Postman]
   */
  @Post('generate-qr')
  @Roles('TEACHER')
  async generateQr(@Request() req: AuthRequest, @Body() dto: GenerateQrDto) {
    return this.attendanceService.generateQr(req.user.sub, dto);
  }

  /**
   * Stop an active attendance session
   * POST /attendance/stop-session [Test នៅ Postman]
   */
  @Post('stop-session')
  @Roles('TEACHER')
  async stopSession(@Request() req: AuthRequest, @Body() dto: StopSessionDto) {
    return this.attendanceService.stopSession(req.user.sub, dto.sessionId);
  }

  /**
   * Get the teacher's current active session
   * GET /attendance/active-session
   */
  @Get('active-session')
  @Roles('TEACHER')
  async getActiveSession(@Request() req: AuthRequest) {
    const session = await this.attendanceService.getActiveSession(req.user.sub);
    return { session };
  }

  /**
   * Get attendance records for a specific session
   * GET /attendance/session/:sessionId/records
   */
  @Get('session/:sessionId/records')
  @Roles('TEACHER')
  async getSessionAttendance(
    @Request() req: AuthRequest,
    @Param('sessionId') sessionId: string,
  ) {
    const records = await this.attendanceService.getSessionAttendance(
      req.user.sub,
      sessionId,
    );
    return { records };
  }

  /**
   * Get session details with attendance
   * GET /attendance/session/:sessionId
   */
  @Get('session/:sessionId')
  @Roles('TEACHER')
  async getSessionDetails(
    @Request() req: AuthRequest,
    @Param('sessionId') sessionId: string,
  ) {
    return this.attendanceService.getSessionDetails(req.user.sub, sessionId);
  }

  /**
   * Mark attendance manually
   * POST /attendance/manual
   */
  @Post('manual')
  @Roles('TEACHER')
  async markManualAttendance(
    @Request() req: AuthRequest,
    @Body() dto: ManualAttendanceDto,
  ) {
    return this.attendanceService.markManualAttendance(req.user.sub, dto);
  }

  /**
   * Get students for a course (for manual attendance)
   * GET /attendance/students?department=X&year=Y
   * Example: /attendance/students?department=Computer%20Science&year=2
   */
  @Get('students')
  @Roles('TEACHER')
  async getStudentsForCourse(
    @Query('department') department: string,
    @Query('year') year: string,
  ) {
    const students = await this.attendanceService.getStudentsForCourse(
      department,
      year,
    );
    return { students };
  }

  /**
   * Get teacher's session history
   * GET /attendance/history
   */
  @Get('history')
  @Roles('TEACHER')
  async getSessionHistory(
    @Request() req: AuthRequest,
    @Query('limit') limit?: number,
  ) {
    const sessions = await this.attendanceService.getSessionHistory(
      req.user.sub,
      limit || 10,
    );
    return { sessions };
  }

  // ========== Student Endpoints ==========

  /**
   * Submit attendance via QR upload
   * POST /attendance/submit
   */
  @Post('submit')
  @Roles('STUDENT')
  async submitAttendance(
    @Request() req: AuthRequest,
    @Body() dto: SubmitAttendanceDto,
  ) {
    return this.attendanceService.submitAttendance(req.user.sub, dto);
  }

  /**
   * Get available active sessions for students to join
   * GET /attendance/student/available-sessions
   */
  @Get('student/available-sessions')
  @Roles('STUDENT')
  async getAvailableSessions(
    @Query('department') department?: string,
    @Query('year') year?: string,
    @Query('courseId') courseId?: string,
  ) {
    const sessions =
      await this.attendanceService.getAvailableSessionsForStudent(
        department,
        year,
        courseId,
      );
    return { sessions };
  }

  /**
   * Get student's attendance history
   * GET /attendance/student/my-attendance
   */
  @Get('student/my-attendance')
  @Roles('STUDENT')
  async getMyAttendance(
    @Request() req: AuthRequest,
    @Query('limit') limit?: number,
  ) {
    const records = await this.attendanceService.getStudentAttendanceHistory(
      req.user.sub,
      limit || 20,
    );
    return { records };
  }

  /**
   * Check if student already submitted attendance for a session
   * GET /attendance/student/check-submission/:sessionId
   */
  @Get('student/check-submission/:sessionId')
  @Roles('STUDENT')
  async checkSubmission(
    @Request() req: AuthRequest,
    @Param('sessionId') sessionId: string,
  ) {
    const record = await this.attendanceService.checkStudentSubmission(
      req.user.sub,
      sessionId,
    );
    return { submitted: !!record, record };
  }

  /**
   * Validate QR token and get session info (without submitting)
   * POST /attendance/student/validate-qr
   */
  @Post('student/validate-qr')
  @Roles('STUDENT')
  async validateQrToken(
    @Request() req: AuthRequest,
    @Body() body: { qrToken: string },
  ) {
    return this.attendanceService.validateQrToken(req.user.sub, body.qrToken);
  }
}

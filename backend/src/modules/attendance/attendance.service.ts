import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { AttendanceSession } from './entities/attendance-session.entity';
import {
  AttendanceRecord,
  AttendanceStatus,
} from './entities/attendance-record.entity';
import { GenerateQrDto } from './dto/generate-qr.dto';
import { ManualAttendanceDto } from './dto/manual-attendance.dto';
import { SubmitAttendanceDto } from './dto/submit-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { User } from '../users/entities/user.entity';

const QR_EXPIRY_MINUTES = 2;

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceSession)
    private sessionRepository: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private recordRepository: Repository<AttendanceRecord>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async generateQr(
    teacherId: string,
    dto: GenerateQrDto,
  ): Promise<{
    sessionId: string;
    qrToken: string;
    expiryTime: Date;
    expiresInSeconds: number;
  }> {
    // Stop any active sessions for this teacher
    await this.stopActiveSessionsForTeacher(teacherId);

    // Generate secure QR token
    const qrToken = this.generateSecureToken();

    const hashedPassword = await bcrypt.hash(dto.sessionPassword, 10);

    const now = new Date();
    const expiryTime = new Date(now.getTime() + QR_EXPIRY_MINUTES * 60 * 1000);

    const session = this.sessionRepository.create({
      teacherId,
      courseId: dto.courseId,
      courseName: dto.courseName,
      department: dto.department,
      year: dto.year,
      sessionName: dto.sessionName,
      sessionPassword: hashedPassword,
      qrToken,
      sessionDate: now,
      expiryTime,
      status: 'ACTIVE',
    });

    await this.sessionRepository.save(session);

    // Schedule automatic expiry check
    this.scheduleSessionExpiry(session.id, QR_EXPIRY_MINUTES * 60 * 1000);

    return {
      sessionId: session.id,
      qrToken,
      expiryTime,
      expiresInSeconds: QR_EXPIRY_MINUTES * 60,
    };
  }

  async stopSession(
    teacherId: string,
    sessionId: string,
  ): Promise<{ message: string; stoppedAt: Date }> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, teacherId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Session is not active');
    }

    session.status = 'STOPPED';
    session.expiryTime = new Date();
    await this.sessionRepository.save(session);

    return {
      message: 'Attendance session stopped successfully',
      stoppedAt: session.expiryTime,
    };
  }

  // Get the current active session for a teacher
  async getActiveSession(teacherId: string): Promise<AttendanceSession | null> {
    // First, expire any sessions that are past their expiry time
    await this.expireOldSessions();

    return this.sessionRepository.findOne({
      where: { teacherId, status: 'ACTIVE' },
      relations: ['attendanceRecords', 'attendanceRecords.student'],
    });
  }

  // Get attendance records for a session
  async getSessionAttendance(
    teacherId: string,
    sessionId: string,
  ): Promise<AttendanceRecord[]> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, teacherId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.recordRepository.find({
      where: { sessionId },
      relations: ['student'],
      order: { markedAt: 'DESC' },
    });
  }

  // Get session details with attendance list
  async getSessionDetails(
    teacherId: string,
    sessionId: string,
  ): Promise<AttendanceSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId, teacherId },
      relations: ['attendanceRecords', 'attendanceRecords.student'],
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  // Submit attendance via QR upload (for students)
  async submitAttendance(
    studentId: string,
    dto: SubmitAttendanceDto,
  ): Promise<{ message: string; status: AttendanceStatus }> {
    // Find active session by QR token
    const session = await this.sessionRepository.findOne({
      where: { qrToken: dto.qrToken },
      select: ['id', 'status', 'expiryTime', 'sessionPassword', 'teacherId'],
    });

    if (!session) {
      throw new NotFoundException('Invalid QR code');
    }

    // Check if session is still active
    if (session.status !== 'ACTIVE') {
      throw new BadRequestException('Attendance session has ended');
    }

    // Check if session has expired
    if (new Date() > session.expiryTime) {
      await this.expireSession(session.id);
      throw new BadRequestException('QR code has expired');
    }

    // Verify session password
    const isPasswordValid = await bcrypt.compare(
      dto.sessionPassword,
      session.sessionPassword,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Invalid session password');
    }

    // Check if student already marked attendance
    const existing = await this.recordRepository.findOne({
      where: { sessionId: session.id, studentId },
    });

    if (existing) {
      throw new BadRequestException('Attendance already marked');
    }

    // Create attendance record
    const record = this.recordRepository.create({
      sessionId: session.id,
      studentId,
      status: 'PRESENT',
      markedAt: new Date(),
    });

    await this.recordRepository.save(record);

    return {
      message: 'Attendance marked successfully',
      status: 'PRESENT',
    };
  }

  // Mark attendance manually (teacher only)
  async markManualAttendance(
    teacherId: string,
    dto: ManualAttendanceDto,
  ): Promise<AttendanceRecord> {
    // Verify session belongs to teacher
    const session = await this.sessionRepository.findOne({
      where: { id: dto.sessionId, teacherId },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    // Check if record already exists
    let record = await this.recordRepository.findOne({
      where: { sessionId: dto.sessionId, studentId: dto.studentId },
    });

    if (record) {
      // Update existing record
      record.status = dto.status;
      record.markedBy = teacherId;
      record.remarks = dto.remarks || record.remarks;
      record.markedAt = new Date();
    } else {
      // Create new record
      record = this.recordRepository.create({
        sessionId: dto.sessionId,
        studentId: dto.studentId,
        status: dto.status,
        markedBy: teacherId,
        markedAt: new Date(),
        remarks: dto.remarks,
      });
    }

    await this.recordRepository.save(record);

    // Reload with student relation
    return (await this.recordRepository.findOne({
      where: { id: record.id },
      relations: ['student'],
    }))!;
  }

  // Get all students for a course (for manual attendance)
  async getStudentsForCourse(
    department: string,
    year: string,
  ): Promise<User[]> {
    // TODO: Filter by department and year when student entity has these fields
    console.log(`Fetching students for ${department}, Year ${year}`);
    return this.userRepository.find({
      where: { role: 'STUDENT' },
      order: { email: 'ASC' },
    });
  }

  // Get teacher's session history
  async getSessionHistory(
    teacherId: string,
    limit: number = 10,
  ): Promise<AttendanceSession[]> {
    return this.sessionRepository.find({
      where: { teacherId },
      relations: ['attendanceRecords'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  // Get recent attendance records for teacher to review/edit
  async getRecentRecords(
    teacherId: string,
    limit: number = 50,
    offset: number = 0,
    department?: string,
    year?: string,
  ): Promise<AttendanceRecord[]> {
    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.student', 'student')
      .leftJoinAndSelect('record.session', 'session')
      .where('session.teacherId = :teacherId', { teacherId });

    if (department) {
      queryBuilder.andWhere('session.department = :department', { department });
    }

    if (year) {
      queryBuilder.andWhere('session.year = :year', { year });
    }

    return queryBuilder
      .orderBy('record.markedAt', 'DESC')
      .skip(offset)
      .take(limit)
      .getMany();
  }

  // Update an attendance record
  async updateAttendanceRecord(
    teacherId: string,
    recordId: string,
    dto: UpdateAttendanceDto,
  ): Promise<AttendanceRecord> {
    // Find the record and verify it belongs to teacher's session
    const record = await this.recordRepository.findOne({
      where: { id: recordId },
      relations: ['session', 'student'],
    });

    if (!record) {
      throw new NotFoundException('Attendance record not found');
    }

    if (record.session.teacherId !== teacherId) {
      throw new ForbiddenException(
        'You do not have permission to edit this record',
      );
    }

    // Update the record
    record.status = dto.status as AttendanceStatus;
    record.remarks = dto.remarks || record.remarks;
    record.markedBy = teacherId;
    record.markedAt = new Date();

    await this.recordRepository.save(record);

    return record;
  }

  private generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  private async stopActiveSessionsForTeacher(teacherId: string): Promise<void> {
    await this.sessionRepository.update(
      { teacherId, status: 'ACTIVE' },
      { status: 'STOPPED', expiryTime: new Date() },
    );
  }

  private async expireOldSessions(): Promise<void> {
    await this.sessionRepository.update(
      {
        status: 'ACTIVE',
        expiryTime: LessThan(new Date()),
      },
      { status: 'EXPIRED' },
    );
  }

  private async expireSession(sessionId: string): Promise<void> {
    await this.sessionRepository.update(
      { id: sessionId },
      { status: 'EXPIRED' },
    );
  }

  private scheduleSessionExpiry(sessionId: string, delay: number): void {
    setTimeout(() => {
      void (async () => {
        try {
          const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
          });
          if (session && session.status === 'ACTIVE') {
            session.status = 'EXPIRED';
            await this.sessionRepository.save(session);
          }
        } catch (error) {
          console.error('Error expiring session:', error);
        }
      })();
    }, delay);
  }

  // ========== Student Methods ==========

  // Get available active sessions for students to join
  async getAvailableSessionsForStudent(
    department?: string,
    year?: string,
    courseId?: string,
  ): Promise<
    Array<{
      id: string;
      courseName: string;
      department: string;
      year: string;
      sessionName: string;
      expiryTime: Date;
      remainingSeconds: number;
    }>
  > {
    // First expire old sessions
    await this.expireOldSessions();

    const queryBuilder = this.sessionRepository
      .createQueryBuilder('session')
      .select([
        'session.id',
        'session.courseName',
        'session.department',
        'session.year',
        'session.sessionName',
        'session.expiryTime',
        'session.courseId',
      ])
      .where('session.status = :status', { status: 'ACTIVE' });

    if (department) {
      queryBuilder.andWhere('session.department = :department', { department });
    }

    if (year) {
      queryBuilder.andWhere('session.year = :year', { year });
    }

    if (courseId) {
      queryBuilder.andWhere('session.courseId = :courseId', { courseId });
    }

    const sessions = await queryBuilder.getMany();

    return sessions.map((session) => ({
      id: session.id,
      courseName: session.courseName,
      department: session.department,
      year: session.year,
      sessionName: session.sessionName,
      expiryTime: session.expiryTime,
      remainingSeconds: Math.max(
        0,
        Math.floor((session.expiryTime.getTime() - Date.now()) / 1000),
      ),
    }));
  }

  // Get student's attendance history
  async getStudentAttendanceHistory(
    studentId: string,
    limit: number = 20,
    skip: number = 0,
  ): Promise<AttendanceRecord[]> {
    return this.recordRepository.find({
      where: { studentId },
      relations: ['session'],
      order: { markedAt: 'DESC' },
      take: limit,
      skip: skip,
    });
  }

  // Check if student already submitted attendance for a session
  async checkStudentSubmission(
    studentId: string,
    sessionId: string,
  ): Promise<AttendanceRecord | null> {
    return this.recordRepository.findOne({
      where: { studentId, sessionId },
      relations: ['session'],
    });
  }

  // Validate QR token and return session info (without submitting)
  async validateQrToken(
    studentId: string,
    qrToken: string,
  ): Promise<{
    valid: boolean;
    session?: {
      id: string;
      courseName: string;
      department: string;
      year: string;
      sessionName: string;
      expiryTime: Date;
      remainingSeconds: number;
    };
    alreadySubmitted?: boolean;
    error?: string;
  }> {
    const session = await this.sessionRepository.findOne({
      where: { qrToken },
      select: [
        'id',
        'status',
        'expiryTime',
        'courseName',
        'department',
        'year',
        'sessionName',
      ],
    });

    if (!session) {
      return { valid: false, error: 'Invalid QR code' };
    }

    if (session.status !== 'ACTIVE') {
      return { valid: false, error: 'Session has ended' };
    }

    const now = new Date();
    if (now > session.expiryTime) {
      return { valid: false, error: 'QR code has expired' };
    }

    // Check if already submitted
    const existing = await this.recordRepository.findOne({
      where: { sessionId: session.id, studentId },
    });

    if (existing) {
      return {
        valid: false,
        alreadySubmitted: true,
        error: 'You have already submitted attendance for this session',
      };
    }

    return {
      valid: true,
      session: {
        id: session.id,
        courseName: session.courseName,
        department: session.department,
        year: session.year,
        sessionName: session.sessionName,
        expiryTime: session.expiryTime,
        remainingSeconds: Math.max(
          0,
          Math.floor((session.expiryTime.getTime() - now.getTime()) / 1000),
        ),
      },
    };
  }
}

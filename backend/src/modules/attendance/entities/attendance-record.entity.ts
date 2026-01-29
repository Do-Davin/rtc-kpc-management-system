import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AttendanceSession } from './attendance-session.entity';

export type AttendanceStatus = 'PRESENT' | 'MANUAL_PRESENT' | 'ABSENT';

@Entity('attendance_records')
@Unique(['sessionId', 'studentId'])
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sessionId: string;

  @ManyToOne(() => AttendanceSession, (session) => session.attendanceRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sessionId' })
  session: AttendanceSession;

  @Column()
  studentId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column({ default: 'PRESENT' })
  status: AttendanceStatus;

  @Column({ type: 'timestamp', nullable: true })
  markedAt: Date;

  @Column({ nullable: true })
  markedBy: string; // teacherId if manual, null if QR upload

  @Column({ nullable: true })
  remarks: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

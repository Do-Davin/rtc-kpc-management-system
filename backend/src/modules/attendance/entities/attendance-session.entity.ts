import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AttendanceRecord } from './attendance-record.entity';

export type SessionStatus = 'ACTIVE' | 'EXPIRED' | 'STOPPED';

@Entity('attendance_sessions')
export class AttendanceSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacherId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column()
  courseId: string;

  @Column()
  courseName: string;

  @Column()
  department: string;

  @Column()
  year: string;

  @Column()
  sessionName: string;

  @Column({ select: false })
  sessionPassword: string;

  @Column({ unique: true })
  qrToken: string;

  @Column({ type: 'timestamp' })
  sessionDate: Date;

  @Column({ type: 'timestamp' })
  expiryTime: Date;

  @Column({ default: 'ACTIVE' })
  status: SessionStatus;

  @OneToMany(() => AttendanceRecord, (record) => record.session)
  attendanceRecords: AttendanceRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

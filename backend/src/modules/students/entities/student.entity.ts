import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from '../../departments/entities/department.entity';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  GRADUATED = 'GRADUATED',
}

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', generated: 'increment', unique: true })
  studentNumber: number;

  @Column({ unique: true })
  studentIdCard: string; // Format: rtc[studentNumber] - auto-generated

  @Column()
  fullName: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column('int')
  year: number;

  @Column('int')
  enrollmentYear: number;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: StudentStatus,
    default: StudentStatus.ACTIVE,
  })
  status: StudentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Department, (dept) => dept.students, {
    onDelete: 'RESTRICT',
  })
  department: Department;
}

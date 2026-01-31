import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Department } from '../../departments/entities/department.entity';

export enum ScheduleType {
  LECTURE = 'Lecture',
  PRACTICAL = 'Practical',
  LAB = 'Lab',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subjectName: string;

  @Column()
  group: string;

  @Column()
  year: string;

  @Column({ type: 'simple-array', nullable: true })
  disabledYears?: string[];

  @Column()
  room: string;

  @Column()
  day: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({ nullable: true })
  color: string;

  @Column({
    type: 'enum',
    enum: ScheduleType,
    default: ScheduleType.LECTURE,
  })
  type: ScheduleType;

  @ManyToOne(() => Teacher, { eager: true, onDelete: 'CASCADE' })
  teacher: Teacher;

  @ManyToOne(() => Department, { eager: true, onDelete: 'CASCADE' })
  department: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

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

export enum CourseLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
}

export enum CourseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({
    type: 'enum',
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level: CourseLevel;

  @Column({ type: 'int', default: 0 })
  duration: number; // in hours

  @Column({ type: 'int', default: 0 })
  students: number; // enrolled students count

  @Column({ type: 'int', default: 0 })
  progress: number; // course progress percentage

  @Column({
    type: 'enum',
    enum: CourseStatus,
    default: CourseStatus.ACTIVE,
  })
  status: CourseStatus;

  @ManyToOne(() => Teacher, { onDelete: 'CASCADE' })
  teacher: Teacher;

  @ManyToOne(() => Department, { onDelete: 'SET NULL', nullable: true })
  department: Department;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

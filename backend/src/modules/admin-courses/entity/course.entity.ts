import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  subtitle: string;

  @Column({ unique: true, nullable: true })
  courseCode: string;

  @Column('int', { nullable: true })
  year: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ nullable: true })
  professorName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many courses belong to one department
  @ManyToOne(() => Department, (department) => department.courses, {
    onDelete: 'RESTRICT',
    nullable: true,
  })
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ nullable: true })
  departmentId: string;

  // Progress checkpoints for course completion tracking
  @Column({ type: 'boolean', default: false })
  progress1: boolean;

  @Column({ type: 'boolean', default: false })
  progress2: boolean;

  @Column({ type: 'boolean', default: false })
  progress3: boolean;
}

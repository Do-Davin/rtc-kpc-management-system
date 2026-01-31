import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export type TodoStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

@Entity('teacher_todos')
export class TeacherTodo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  teacherId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'PENDING' })
  status: TodoStatus;

  @Column({ type: 'date', nullable: true })
  dueDate: Date | null;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

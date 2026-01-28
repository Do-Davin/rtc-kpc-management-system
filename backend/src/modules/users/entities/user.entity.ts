import { Student } from 'src/modules/students/entities/student.entity';
import { Teacher } from 'src/modules/teachers/entities/teacher.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';


export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: 'STUDENT' })
  role: UserRole;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  refreshTokenHash: string | null;

  
  @OneToOne(() => Student, (student) => student.user)
  student: Student;

  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Teacher;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
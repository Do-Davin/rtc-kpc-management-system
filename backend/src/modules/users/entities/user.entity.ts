import {
  Column,
  CreateDateColumn,
  Entity,
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

  // --- New Fields for Student Info ---
  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  studentId: string; // e.g., "STU001"

  @Column({ nullable: true })
  department: string; // e.g., "Computer Science"

  @Column({ nullable: true })
  year: string; // e.g., "3"
  // ----------------------------------

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    select: false,
  })
  refreshTokenHash: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
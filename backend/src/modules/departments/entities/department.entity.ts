import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Entity('departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string; 

  @Column({ unique: true })
  code: string; 

  
  @Column({ default: 'Active' })
  status: string;

  @OneToMany(() => Student, (student) => student.department)
  students: Student[];

  @OneToMany(() => Teacher, (teacher) => teacher.department)
  teachers: Teacher[];
}
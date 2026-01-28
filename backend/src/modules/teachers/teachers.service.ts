import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher) private teacherRepo: Repository<Teacher>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateTeacherDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const dept = await this.deptRepo.findOneBy({ id: dto.departmentId });
      if (!dept) throw new NotFoundException('Department not found');

      
      const plainPassword = dto.password || 'RTC@2026';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const newUser = this.userRepo.create({
        email: dto.email,
        password: hashedPassword, 
        role: 'TEACHER',
      });
      const savedUser = await queryRunner.manager.save(newUser);

      const newTeacher = this.teacherRepo.create({
        fullName: dto.fullName,
        specialization: dto.specialization,
        user: savedUser,
        department: dept,
        status: dto.status || 'Active',
      });
      const savedTeacher = await queryRunner.manager.save(newTeacher);

      await queryRunner.commitTransaction();
      return savedTeacher;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === '23505') throw new ConflictException('Email already exists');
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.teacherRepo.find({ relations: ['user', 'department'] });
  }

  async findOneByUserId(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department']
    });
    if (!teacher) throw new NotFoundException('Teacher profile not found');
    return teacher;
  }

  async update(id: string, attrs: Partial<Teacher> & { departmentId?: string }) {
    const teacher = await this.teacherRepo.findOneBy({ id });
    if (!teacher) throw new NotFoundException('Teacher not found');

    if (attrs.departmentId) {
      const dept = await this.deptRepo.findOneBy({ id: attrs.departmentId });
      if (!dept) throw new NotFoundException('Department not found');
      teacher.department = dept;
    }
    if (attrs.fullName) teacher.fullName = attrs.fullName;
    if (attrs.specialization) teacher.specialization = attrs.specialization;
    if (attrs.status) teacher.status = attrs.status;

    return this.teacherRepo.save(teacher);
  }

  async remove(id: string) {
    const teacher = await this.teacherRepo.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    if (!teacher) throw new NotFoundException('Teacher not found');
    return this.userRepo.remove(teacher.user);
  }
}
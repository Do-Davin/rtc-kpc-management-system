import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Student, StudentStatus } from './entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Department) private deptRepo: Repository<Department>,
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateStudentDto) {
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
        role: 'STUDENT',
      });
      const savedUser = await queryRunner.manager.save(newUser);

      const newStudent = this.studentRepo.create({
        fullName: dto.fullName,
        studentIdCard: dto.studentIdCard,
        year: dto.year,
        enrollmentYear: dto.enrollmentYear,
        phoneNumber: dto.phoneNumber,
        user: savedUser,
        department: dept,
        status: dto.status || StudentStatus.ACTIVE,
      });
      const savedStudent = await queryRunner.manager.save(newStudent);

      await queryRunner.commitTransaction();
      return savedStudent;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      if (err.code === '23505') throw new ConflictException('Email or ID already exists');
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return this.studentRepo.find({ relations: ['user', 'department'] });
  }

  async findOneByUserId(userId: string) {
    const student = await this.studentRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'department']
    });
    if (!student) throw new NotFoundException('Student profile not found');
    return student;
  }

  async update(id: string, attrs: Partial<Student> & { departmentId?: string }) {
    const student = await this.studentRepo.findOneBy({ id });
    if (!student) throw new NotFoundException('Student not found');
    
    if (attrs.departmentId) {
      const dept = await this.deptRepo.findOneBy({ id: attrs.departmentId });
      if (!dept) throw new NotFoundException('Department not found');
      student.department = dept;
    }
    
    if (attrs.fullName) student.fullName = attrs.fullName;
    if (attrs.studentIdCard) student.studentIdCard = attrs.studentIdCard;
    if (attrs.year) student.year = attrs.year;
    if (attrs.enrollmentYear) student.enrollmentYear = attrs.enrollmentYear;
    if (attrs.phoneNumber) student.phoneNumber = attrs.phoneNumber;
    if (attrs.status) student.status = attrs.status;

    return this.studentRepo.save(student);
  }

  async remove(id: string) {
    const student = await this.studentRepo.findOne({ 
      where: { id }, 
      relations: ['user'] 
    });
    if (!student) throw new NotFoundException('Student not found');
    
    return this.userRepo.remove(student.user);
  }
}
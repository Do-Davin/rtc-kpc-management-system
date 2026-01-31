import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entity/course.entity';
import { Department } from '../departments/entities/department.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

/**
 * Admin Courses Service
 * Handles course CRUD operations for administrators.
 * Admins can create, update, and delete courses.
 * Courses are linked to departments.
 */
@Injectable()
export class AdminCoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(Department)
    private departmentRepo: Repository<Department>,
  ) {}

  async create(dto: CreateCourseDto): Promise<Course> {
    // Verify department exists
    const department = await this.departmentRepo.findOneBy({
      id: dto.departmentId,
    });

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${dto.departmentId} not found`,
      );
    }

    // Check if course code already exists (if provided)
    if (dto.courseCode) {
      const existingCourse = await this.courseRepo.findOneBy({
        courseCode: dto.courseCode,
      });

      if (existingCourse) {
        throw new ConflictException(
          `Course with code ${dto.courseCode} already exists`,
        );
      }
    }

    const newCourse = this.courseRepo.create({
      ...dto,
      status: dto.status ?? true,
      department,
    });

    return this.courseRepo.save(newCourse);
  }

  async findAll(): Promise<Course[]> {
    return this.courseRepo.find({
      relations: ['department'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAllActive(): Promise<Course[]> {
    return this.courseRepo.find({
      where: { status: true },
      relations: ['department'],
      order: { year: 'DESC', createdAt: 'DESC' },
    });
  }

  async findByDepartment(departmentId: string): Promise<Course[]> {
    return this.courseRepo.find({
      where: { departmentId },
      relations: ['department'],
      order: { year: 'DESC', title: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Course> {
    const course = await this.courseRepo.findOne({
      where: { id },
      relations: ['department'],
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, dto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id);

    // Check if course code is being changed and if it already exists
    if (dto.courseCode && dto.courseCode !== course.courseCode) {
      const existingCourse = await this.courseRepo.findOneBy({
        courseCode: dto.courseCode,
      });

      if (existingCourse) {
        throw new ConflictException(
          `Course with code ${dto.courseCode} already exists`,
        );
      }
    }

    // If updating department, verify it exists
    if (dto.departmentId) {
      const department = await this.departmentRepo.findOneBy({
        id: dto.departmentId,
      });

      if (!department) {
        throw new NotFoundException(
          `Department with ID ${dto.departmentId} not found`,
        );
      }

      course.department = department;
      course.departmentId = dto.departmentId;
    }

    // Update other fields
    if (dto.title) course.title = dto.title;
    if (dto.courseCode) course.courseCode = dto.courseCode;
    if (dto.subtitle !== undefined) course.subtitle = dto.subtitle;
    if (dto.year) course.year = dto.year;
    if (dto.status !== undefined) course.status = dto.status;
    if (dto.image !== undefined) course.image = dto.image;
    if (dto.professorName !== undefined)
      course.professorName = dto.professorName;

    return this.courseRepo.save(course);
  }

  async remove(id: string): Promise<void> {
    const course = await this.findOne(id);
    await this.courseRepo.remove(course);
  }

  async toggleStatus(id: string): Promise<Course> {
    const course = await this.findOne(id);
    course.status = !course.status;
    return this.courseRepo.save(course);
  }
}

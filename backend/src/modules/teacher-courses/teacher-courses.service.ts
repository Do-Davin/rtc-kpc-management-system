import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../admin-courses/entity/course.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';

/**
 * Teacher Courses Service
 * This service handles teacher-specific course viewing.
 * Teachers can only VIEW courses assigned to their department.
 * Course creation/update/delete is handled by Admin in the 'admin-courses' module.
 */
@Injectable()
export class TeacherCoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
  ) {}

  /**
   * Get all courses for a teacher's department
   * Teachers see courses based on their department/specialty
   */
  async findAllByTeacherDepartment(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    // Get courses for the teacher's department
    const courses = await this.courseRepo.find({
      where: { departmentId: teacher.department?.id },
      relations: ['department'],
      order: { createdAt: 'DESC' },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      image: course.image,
      courseCode: course.courseCode,
      year: course.year,
      status: course.status,
      professorName: course.professorName,
      departmentId: course.departmentId,
      departmentName: course.department?.name,
      progress1: course.progress1,
      progress2: course.progress2,
      progress3: course.progress3,
      createdAt: course.createdAt,
    }));
  }

  /**
   * Get all active courses for a teacher's department
   */
  async findActiveByTeacherDepartment(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const courses = await this.courseRepo.find({
      where: {
        departmentId: teacher.department?.id,
        status: true,
      },
      relations: ['department'],
      order: { createdAt: 'DESC' },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      image: course.image,
      courseCode: course.courseCode,
      year: course.year,
      status: course.status,
      professorName: course.professorName,
      departmentId: course.departmentId,
      departmentName: course.department?.name,
      progress1: course.progress1,
      progress2: course.progress2,
      progress3: course.progress3,
      createdAt: course.createdAt,
    }));
  }

  /**
   * Get course statistics for a teacher's department
   */
  async getStats(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const courses = await this.courseRepo.find({
      where: { departmentId: teacher.department?.id },
    });

    const totalCourses = courses.length;
    const activeCourses = courses.filter((c) => c.status === true).length;
    const inactiveCourses = courses.filter((c) => c.status === false).length;

    return {
      totalCourses,
      activeCourses,
      inactiveCourses,
      departmentName: teacher.department?.name,
    };
  }

  /**
   * Get a single course by ID (for teacher's department)
   */
  async findOne(userId: string, courseId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['department'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Optional: Check if course belongs to teacher's department
    // if (course.departmentId !== teacher.department?.id) {
    //   throw new ForbiddenException('You can only view courses from your department');
    // }

    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      image: course.image,
      courseCode: course.courseCode,
      year: course.year,
      status: course.status,
      professorName: course.professorName,
      departmentId: course.departmentId,
      departmentName: course.department?.name,
      progress1: course.progress1,
      progress2: course.progress2,
      progress3: course.progress3,
      createdAt: course.createdAt,
    };
  }

  /**
   * Update course progress checkmarks (for teacher's department)
   */
  async updateProgress(
    userId: string,
    courseId: string,
    updateProgressDto: UpdateProgressDto,
  ) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['department'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if course belongs to teacher's department
    if (course.departmentId !== teacher.department?.id) {
      throw new ForbiddenException(
        'You can only update progress for courses in your department',
      );
    }

    // Update progress fields
    if (updateProgressDto.progress1 !== undefined) {
      course.progress1 = updateProgressDto.progress1;
    }
    if (updateProgressDto.progress2 !== undefined) {
      course.progress2 = updateProgressDto.progress2;
    }
    if (updateProgressDto.progress3 !== undefined) {
      course.progress3 = updateProgressDto.progress3;
    }

    await this.courseRepo.save(course);

    return {
      id: course.id,
      title: course.title,
      progress1: course.progress1,
      progress2: course.progress2,
      progress3: course.progress3,
      message: 'Progress updated successfully',
    };
  }
}

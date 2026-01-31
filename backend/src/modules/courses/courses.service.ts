import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course, CourseStatus } from './entities/course.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(Teacher)
    private teacherRepo: Repository<Teacher>,
  ) {}

  /**
   * Get all courses for a teacher
   */
  async findAllByTeacher(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const courses = await this.courseRepo.find({
      where: { teacher: { id: teacher.id } },
      relations: ['department'],
      order: { createdAt: 'DESC' },
    });

    return courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image,
      level: course.level,
      duration: course.duration,
      students: course.students,
      progress: course.progress,
      status: course.status,
      departmentName: course.department?.name,
      createdAt: course.createdAt,
    }));
  }

  /**
   * Get course statistics for a teacher
   */
  async getStats(userId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const courses = await this.courseRepo.find({
      where: { teacher: { id: teacher.id } },
    });

    const totalCourses = courses.length;
    const activeCourses = courses.filter(
      (c) => c.status === CourseStatus.ACTIVE,
    ).length;
    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
    const totalHours = courses.reduce((sum, c) => sum + c.duration, 0);

    return {
      totalCourses,
      activeCourses,
      totalStudents,
      totalHours,
    };
  }

  /**
   * Create a new course
   */
  async create(userId: string, dto: CreateCourseDto) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
      relations: ['department'],
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const course = this.courseRepo.create({
      title: dto.title,
      description: dto.description,
      image: dto.image || '/courses/default.jpg',
      level: dto.level,
      duration: dto.duration || 0,
      status: dto.status || CourseStatus.ACTIVE,
      students: 0,
      progress: 0,
      teacher,
      department: teacher.department,
    });

    const savedCourse = await this.courseRepo.save(course);

    return {
      id: savedCourse.id,
      title: savedCourse.title,
      description: savedCourse.description,
      image: savedCourse.image,
      level: savedCourse.level,
      duration: savedCourse.duration,
      students: savedCourse.students,
      progress: savedCourse.progress,
      status: savedCourse.status,
      departmentName: teacher.department?.name,
      createdAt: savedCourse.createdAt,
    };
  }

  /**
   * Update a course
   */
  async update(userId: string, courseId: string, dto: UpdateCourseDto) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['teacher', 'department'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.teacher.id !== teacher.id) {
      throw new ForbiddenException('You can only update your own courses');
    }

    // Update fields
    if (dto.title !== undefined) course.title = dto.title;
    if (dto.description !== undefined) course.description = dto.description;
    if (dto.image !== undefined) course.image = dto.image;
    if (dto.level !== undefined) course.level = dto.level;
    if (dto.duration !== undefined) course.duration = dto.duration;
    if (dto.students !== undefined) course.students = dto.students;
    if (dto.progress !== undefined) course.progress = dto.progress;
    if (dto.status !== undefined) course.status = dto.status;

    const updatedCourse = await this.courseRepo.save(course);

    return {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      image: updatedCourse.image,
      level: updatedCourse.level,
      duration: updatedCourse.duration,
      students: updatedCourse.students,
      progress: updatedCourse.progress,
      status: updatedCourse.status,
      departmentName: course.department?.name,
      createdAt: updatedCourse.createdAt,
    };
  }

  /**
   * Delete a course
   */
  async remove(userId: string, courseId: string) {
    const teacher = await this.teacherRepo.findOne({
      where: { user: { id: userId } },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher profile not found');
    }

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['teacher'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (course.teacher.id !== teacher.id) {
      throw new ForbiddenException('You can only delete your own courses');
    }

    await this.courseRepo.remove(course);

    return { message: 'Course deleted successfully' };
  }
}

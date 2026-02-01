import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Department } from '../departments/entities/department.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * Check if there's a schedule conflict (same day, overlapping time, same department, year, and group)
   */
  private async checkScheduleConflict(
    departmentId: string,
    year: string,
    group: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<Schedule | null> {
    const queryBuilder = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.department', 'department')
      .where('department.id = :departmentId', { departmentId })
      .andWhere('schedule.year = :year', { year })
      .andWhere('schedule.group = :group', { group })
      .andWhere('schedule.day = :day', { day })
      // Check for time overlap: new schedule starts before existing ends AND new schedule ends after existing starts
      .andWhere(
        '(schedule.startTime < :endTime AND schedule.endTime > :startTime)',
        { startTime, endTime },
      );

    // Exclude current schedule when updating
    if (excludeId) {
      queryBuilder.andWhere('schedule.id != :excludeId', { excludeId });
    }

    return queryBuilder.getOne();
  }

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const { teacherId, departmentId, ...scheduleData } = createScheduleDto;

    const teacher = await this.teacherRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    const department = await this.departmentRepository.findOne({
      where: { id: departmentId },
    });
    if (!department) {
      throw new NotFoundException(`Department with ID ${departmentId} not found`);
    }

    // Check for schedule conflict
    const conflictingSchedule = await this.checkScheduleConflict(
      departmentId,
      scheduleData.year,
      scheduleData.group,
      scheduleData.day,
      scheduleData.startTime,
      scheduleData.endTime,
    );

    if (conflictingSchedule) {
      throw new ConflictException(
        `Schedule conflict: "${conflictingSchedule.subjectName}" is already scheduled for ${conflictingSchedule.day} from ${conflictingSchedule.startTime} to ${conflictingSchedule.endTime} for Group ${conflictingSchedule.group}`,
      );
    }

    const schedule = this.scheduleRepository.create({
      ...scheduleData,
      teacher,
      department,
    });

    return this.scheduleRepository.save(schedule);
  }

  async findAll(departmentId?: string, year?: string): Promise<Schedule[]> {
    const queryBuilder = this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.teacher', 'teacher')
      .leftJoinAndSelect('schedule.department', 'department');

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', { departmentId });
    }

    if (year) {
      queryBuilder.andWhere('schedule.year = :year', { year });
    }

    queryBuilder.orderBy('schedule.day', 'ASC');
    queryBuilder.addOrderBy('schedule.startTime', 'ASC');

    return queryBuilder.getMany();
  }

  async findByTeacher(teacherId: string): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      where: { teacher: { id: teacherId } },
      relations: ['teacher', 'department'],
      order: { day: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['teacher', 'department'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);

    const { teacherId, departmentId, ...scheduleData } = updateScheduleDto;

    if (teacherId) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: teacherId },
      });
      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
      }
      schedule.teacher = teacher;
    }

    if (departmentId) {
      const department = await this.departmentRepository.findOne({
        where: { id: departmentId },
      });
      if (!department) {
        throw new NotFoundException(`Department with ID ${departmentId} not found`);
      }
      schedule.department = department;
    }

    Object.assign(schedule, scheduleData);

    // Check for schedule conflict when updating (exclude current schedule)
    const checkDepartmentId = departmentId || schedule.department.id;
    const checkYear = scheduleData.year || schedule.year;
    const checkGroup = scheduleData.group || schedule.group;
    const checkDay = scheduleData.day || schedule.day;
    const checkStartTime = scheduleData.startTime || schedule.startTime;
    const checkEndTime = scheduleData.endTime || schedule.endTime;

    const conflictingSchedule = await this.checkScheduleConflict(
      checkDepartmentId,
      checkYear,
      checkGroup,
      checkDay,
      checkStartTime,
      checkEndTime,
      id, // Exclude current schedule
    );

    if (conflictingSchedule) {
      throw new ConflictException(
        `Schedule conflict: "${conflictingSchedule.subjectName}" is already scheduled for ${conflictingSchedule.day} from ${conflictingSchedule.startTime} to ${conflictingSchedule.endTime} for Group ${conflictingSchedule.group}`,
      );
    }

    return this.scheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.remove(schedule);
  }
}

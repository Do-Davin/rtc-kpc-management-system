import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ScheduleType } from '../entities/schedule.entity';

export class CreateScheduleDto {
  @IsString()
  subjectName: string;

  @IsString()
  group: string;

  @IsString()
  year: string;

  @IsOptional()
  disabledYears?: string[];

  @IsString()
  room: string;

  @IsString()
  day: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  @IsOptional()
  color?: string;

  @IsEnum(ScheduleType)
  @IsOptional()
  type?: ScheduleType;

  @IsUUID()
  teacherId: string;

  @IsUUID()
  departmentId: string;
}

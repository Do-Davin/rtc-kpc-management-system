import { IsEmail, IsNotEmpty, IsString, IsUUID, IsOptional, MinLength, IsEnum } from 'class-validator';
import { TeacherStatus } from '../entities/teacher.entity';

export class CreateTeacherDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string; 

  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsUUID()
  departmentId: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(TeacherStatus)
  status?: TeacherStatus;
}
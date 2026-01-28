import { IsEmail, IsNotEmpty, IsString, IsUUID, IsOptional, MinLength } from 'class-validator';

export class CreateTeacherDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string; 

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
  @IsString()
  status?: string;
}
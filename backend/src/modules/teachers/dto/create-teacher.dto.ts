import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

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
}
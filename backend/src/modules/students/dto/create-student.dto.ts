import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  fullName: string; 

  @IsString()
  @IsNotEmpty()
  studentIdCard: string;

  @IsUUID()
  departmentId: string;
}
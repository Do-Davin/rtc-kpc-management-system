import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class GenerateQrDto {
  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  year: string;

  @IsNotEmpty()
  @IsString()
  sessionName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4, { message: 'Session password must be at least 4 characters' })
  sessionPassword: string;
}

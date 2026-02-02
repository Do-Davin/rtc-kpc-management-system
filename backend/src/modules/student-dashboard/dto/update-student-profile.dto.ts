import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateStudentProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

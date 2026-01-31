/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';

export class CreateCourseDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  year: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  status?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  departmentId: string;

  @IsOptional()
  @IsString()
  professorName?: string;
}

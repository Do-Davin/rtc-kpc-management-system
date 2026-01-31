/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsNumber()
  @Min(2000)
  @Max(2100)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  year?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  status?: boolean;

  @IsOptional()
  @IsString()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsString()
  professorName?: string;
}

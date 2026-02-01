import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { BookCategory } from '../entities/book.entity';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(2100)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  year?: number;

  @IsOptional()
  @IsString()
  cover?: string;

  @IsOptional()
  @IsEnum(BookCategory)
  category?: BookCategory;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  available?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  pages?: number;
}

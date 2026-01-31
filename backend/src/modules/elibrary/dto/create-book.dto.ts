import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  cover?: string;

  @IsString()
  @IsOptional()
  year?: string;

  @IsNumber()
  @IsOptional()
  pages?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  bookUrl?: string;
}

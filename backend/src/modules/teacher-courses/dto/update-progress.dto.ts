import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProgressDto {
  @IsOptional()
  @IsBoolean()
  progress1?: boolean;

  @IsOptional()
  @IsBoolean()
  progress2?: boolean;

  @IsOptional()
  @IsBoolean()
  progress3?: boolean;
}

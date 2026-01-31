import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  recordId: string;

  @IsNotEmpty()
  @IsEnum(['PRESENT', 'MANUAL_PRESENT', 'ABSENT', 'LATE'], {
    message: 'Status must be PRESENT, MANUAL_PRESENT, ABSENT or LATE',
  })
  status: 'PRESENT' | 'MANUAL_PRESENT' | 'ABSENT' | 'LATE';

  @IsOptional()
  @IsString()
  remarks?: string;
}

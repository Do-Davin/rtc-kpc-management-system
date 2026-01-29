import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class ManualAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;

  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @IsNotEmpty()
  @IsEnum(['MANUAL_PRESENT', 'ABSENT', 'LATE'], {
    message: 'Status must be MANUAL_PRESENT, ABSENT or LATE',
  })
  status: 'MANUAL_PRESENT' | 'ABSENT' | 'LATE';

  @IsOptional()
  @IsString()
  remarks?: string;
}

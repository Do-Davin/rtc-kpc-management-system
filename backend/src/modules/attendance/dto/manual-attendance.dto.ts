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
  @IsEnum(['MANUAL_PRESENT', 'ABSENT'], {
    message: 'Status must be MANUAL_PRESENT or ABSENT',
  })
  status: 'MANUAL_PRESENT' | 'ABSENT';

  @IsOptional()
  @IsString()
  remarks?: string;
}

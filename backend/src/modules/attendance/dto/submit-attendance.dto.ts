import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitAttendanceDto {
  @IsNotEmpty()
  @IsString()
  qrToken: string;

  @IsNotEmpty()
  @IsString()
  sessionPassword: string;
}

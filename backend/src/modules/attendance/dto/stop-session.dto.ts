import { IsNotEmpty, IsUUID } from 'class-validator';

export class StopSessionDto {
  @IsNotEmpty()
  @IsUUID()
  sessionId: string;
}

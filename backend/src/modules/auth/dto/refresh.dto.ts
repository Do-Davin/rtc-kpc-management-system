import { IsString } from 'class-validator';

export class RefreshDto {
  // Experience: [Refresh endpoint never trusts userId from body]
  // @IsUUID()
  // userId: string;

  @IsString()
  refresh_token: string;
}

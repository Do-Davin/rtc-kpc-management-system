import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthRequest } from '../common/types/auth-request.type';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  /**
   * Refresh token (SECURE)
   * - client sends refresh_token only
   * - backend extracts userId from token
   */
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refreshTokens(dto.refresh_token);
  }

  /**
   * Logout endpoint (requires access token)
   * - clears refresh token hash in DB
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Request() req: AuthRequest) {
    return this.authService.logout(req.user.sub);
  }
}

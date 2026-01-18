import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const role = (data.role || 'STUDENT').toUpperCase();

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.users.create({
      ...data,
      role,
      password: hashedPassword,
    });
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user);

    // store refresh token HASH in DB (rotation-ready)
    await this.storeRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  // REFRESH (ROTATION)
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.users.findByIdWithRefreshTokenHash(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const valid = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!valid) throw new UnauthorizedException('Refresh token invalid');

    const tokens = await this.issueTokens(user);

    await this.storeRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

  // LOGOUT (invalidate refresh token)
  async logout(userId: string) {
    await this.users.clearRefreshTokenHash(userId);
    return { message: 'Logged out' };
  }

  // INTERNAL: issue tokens
  private async issueTokens(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: String(user.role).toUpperCase() as 'STUDENT' | 'TEACHER' | 'ADMIN',
    };

    // NOTE: expirations are configured in JwtModule (AuthModule)
    const [access_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, { expiresIn: '15m' }),
      this.jwt.signAsync(payload, { expiresIn: '7d' }),
    ]);

    return { access_token, refresh_token };
  }

  private async storeRefreshTokenHash(userId: string, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.users.updateRefreshTokenHash(userId, refreshTokenHash);
  }
}

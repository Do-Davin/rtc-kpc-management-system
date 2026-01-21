import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.users.create({
      ...data,
      role: (data.role || 'STUDENT').toUpperCase(),
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

  // REFRESH TOKEN (SECURE + ROTATION)
  async refreshTokens(refreshToken: string) {
    let payload: JwtPayload;

    try {
      payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const user = await this.users.findByIdWithRefreshTokenHash(payload.sub);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) throw new UnauthorizedException('Refresh token invalid');

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
  private async issueTokens(user: User) {
    const payload: JwtPayload & { jti: string } = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: crypto.randomUUID(), // Unique token
    };

    const access_token = await this.jwt.signAsync(payload);

    const refresh_token = await this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.config.getOrThrow('JWT_REFRESH_EXPIRES'),
    });

    return { access_token, refresh_token };
  }

  private async storeRefreshTokenHash(userId: string, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.users.updateRefreshTokenHash(userId, hash);
  }
}

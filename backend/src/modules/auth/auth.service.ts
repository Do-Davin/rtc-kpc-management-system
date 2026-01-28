import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Department } from '../departments/entities/department.entity';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
    private config: ConfigService,
    private dataSource: DataSource,
  ) {}

  async register(data: RegisterDto) {
    // Fixed: Check by EMAIL
    const existingUser = await this.users.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create User
      const newUser = queryRunner.manager.create(User, {
        email: data.email,
        password: hashedPassword,
        role: (data.role || 'STUDENT') as UserRole,
      });
      const savedUser = await queryRunner.manager.save(newUser);

      // 2. Create Profile (Optional/Basic)
      if (savedUser.role === 'STUDENT' && (data as any).fullName) {
         // Logic to create student profile if data exists
         // Note: Usually Admin creates students, but this handles self-registration if enabled
      }

      await queryRunner.commitTransaction();
      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user);
    await this.storeRefreshTokenHash(user.id, tokens.refresh_token);

    return tokens;
  }

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
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Refresh token invalid');

    const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!match) throw new UnauthorizedException('Refresh token invalid');

    const tokens = await this.issueTokens(user);
    await this.storeRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.users.clearRefreshTokenHash(userId);
    return { message: 'Logged out' };
  }

  private async issueTokens(user: User) {
    const payload: JwtPayload & { jti: string } = {
      sub: user.id,
      email: user.email,
      role: user.role,
      jti: crypto.randomUUID(),
    };
    return {
      access_token: await this.jwt.signAsync(payload),
      refresh_token: await this.jwt.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.config.getOrThrow('JWT_REFRESH_EXPIRES'),
      }),
    };
  }

  private async storeRefreshTokenHash(userId: string, token: string) {
    const hash = await bcrypt.hash(token, 10);
    await this.users.updateRefreshTokenHash(userId, hash);
  }
}
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // Token expired
    if (info?.name === 'TokenExpiredError') {
      throw new UnauthorizedException({
        error: 'TOKEN_EXPIRED',
        message: 'Access token has expired',
      });
    }

    // Invalid token (malformed, wrong signature, etc.)
    if (info?.name === 'JsonWebTokenError') {
      throw new UnauthorizedException({
        error: 'TOKEN_INVALID',
        message: 'Invalid access token',
      });
    }

    // Missing token or no user
    if (!user) {
      throw new UnauthorizedException({
        error: 'TOKEN_MISSING',
        message: 'Authorization token missing',
      });
    }

    return user;
  }
}

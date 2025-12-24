import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  firstName: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) throw new Error('JWT_REFRESH_SECRET is not defined');
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.['refreshToken'] as
            | string
            | undefined;
          return token || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const refreshToken = request?.cookies?.['refreshToken'] as
      | string
      | undefined;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const user = await this.authService.validateUserRefreshToken(
      payload.id,
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return user;
  }
}

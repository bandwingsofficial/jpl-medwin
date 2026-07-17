import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenPort } from '@/application/ports/token.port';
import { InvalidTokenException } from '@/domain/exceptions/token/invalid-token.exception';

type AccessPayload = {
  sub: string;
  sessionId: string;
  tokenVersion: number;
  role: string;
  type: 'access';
};

type RefreshPayload = {
  sub: string;
  sessionId: string;
  tokenVersion: number;
  type: 'refresh';
};

@Injectable()
export class JwtTokenAdapter implements TokenPort {
  constructor(private readonly jwtService: JwtService) {}

  // =======================
  // ACCESS TOKEN
  // =======================

  async generateAccessToken(payload: {
    userId: string;
    sessionId: string;
    tokenVersion: number;
    role: string;
  }): Promise<string> {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET missing');
    }

    return this.jwtService.signAsync(
      {
        sub: payload.userId,
        sessionId: payload.sessionId,
        tokenVersion: payload.tokenVersion,
        role: payload.role,
        type: 'access',
      } as AccessPayload,
      {
        secret, // ✅ CRITICAL FIX
        expiresIn: '15m',
      },
    );
  }

  // =======================
  // REFRESH TOKEN
  // =======================

  async generateRefreshToken(payload: {
    userId: string;
    sessionId: string;
    tokenVersion: number;
  }): Promise<string> {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET missing');
    }

    return this.jwtService.signAsync(
      {
        sub: payload.userId,
        sessionId: payload.sessionId,
        tokenVersion: payload.tokenVersion,
        type: 'refresh',
      } as RefreshPayload,
      {
        secret, // ✅ CRITICAL FIX
        expiresIn: '7d',
      },
    );
  }

  // =======================
  // VERIFY ACCESS TOKEN
  // =======================

  async verifyAccessToken(token: string): Promise<{
    userId: string;
    sessionId: string;
    tokenVersion: number;
    role: string;
  }> {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<AccessPayload>(
        token,
        { secret }, // ✅ CRITICAL FIX
      );

      if (payload.type !== 'access') {
        throw new InvalidTokenException();
      }

      return {
        userId: payload.sub,
        sessionId: payload.sessionId,
        tokenVersion: payload.tokenVersion,
        role: payload.role,
      };
    } catch (err) {
      console.log('❌ Access token verify failed:', err);
      throw new InvalidTokenException();
    }
  }

  // =======================
  // VERIFY REFRESH TOKEN
  // =======================

  async verifyRefreshToken(token: string): Promise<{
    userId: string;
    sessionId: string;
    tokenVersion: number;
  }> {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET missing');
    }

    try {
      const payload = await this.jwtService.verifyAsync<RefreshPayload>(
        token,
        { secret }, // ✅ CRITICAL FIX
      );

      if (payload.type !== 'refresh') {
        throw new InvalidTokenException();
      }

      return {
        userId: payload.sub,
        sessionId: payload.sessionId,
        tokenVersion: payload.tokenVersion,
      };
    } catch (err) {
      console.log('❌ Refresh token verify failed:', err);
      throw new InvalidTokenException();
    }
  }
}

import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

import { SessionRepository } from '@/domain/repositories/session.repository';
import { SessionDomainService } from '@/domain/services/session.domain.service';
import { TOKENS } from '@/common/constants/tokens';

type JwtPayload = {
  sub: string;
  sessionId: string;
  role: string;
  type: 'access' | 'refresh';
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,
    private readonly sessionService: SessionDomainService,
  ) {
    const jwtSecret = process.env.JWT_ACCESS_SECRET;

    if (!jwtSecret) {
      throw new Error('JWT_ACCESS_SECRET missing');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 🍪 Cookie first
        (req: Request) => req?.cookies?.accessToken,

        // 🔑 Bearer fallback
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const userId = payload.sub;
    const { sessionId, role, type } = payload;

    if (!userId || !sessionId || type !== 'access') {
      throw new UnauthorizedException('Invalid token');
    }

    const session = await this.sessionRepo.findById(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    this.sessionService.validateSession(session);

    return {
      userId,
      sessionId,
      role,
    };
  }
}

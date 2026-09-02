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
  console.log("🔥 JWT VALIDATE START", payload);

  const userId = payload.sub;
  const { sessionId, role, type } = payload;

  console.log("🔥 JWT PAYLOAD CHECK", {
    userId,
    sessionId,
    role,
    type,
  });

  if (!userId || !sessionId || type !== 'access') {
    throw new UnauthorizedException('Invalid token');
  }

  console.log("🔥 BEFORE SESSION REPO");

  const session = await this.sessionRepo.findById(sessionId);

  console.log("🔥 AFTER SESSION REPO", session);

  if (!session) {
    throw new UnauthorizedException('Session not found');
  }

  console.log("🔥 BEFORE SESSION VALIDATION");

  this.sessionService.validateSession(session);

  console.log("🔥 JWT VALIDATE SUCCESS");

  return {
    userId,
    sessionId,
    role,
  };
}
}

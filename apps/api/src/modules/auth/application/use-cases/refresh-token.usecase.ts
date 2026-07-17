import { Injectable, Inject } from '@nestjs/common';

import { SessionRepository } from '@/domain/repositories/session.repository';
import { SessionDomainService } from '@/domain/services/session.domain.service';
import { UserRepository } from '@/domain/repositories/user.repository';

import { TokenPort } from '@/application/ports/token.port';

import { TOKENS } from '@/common/constants/tokens';

import { InvalidTokenException } from '@/domain/exceptions/token/invalid-token.exception';

import * as crypto from 'crypto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,

    @Inject(TOKENS.USER_REPO)
    private readonly userRepo: UserRepository, // 🔥 NEW

    @Inject(TOKENS.TOKEN_PORT)
    private readonly tokenPort: TokenPort,

    private readonly sessionService: SessionDomainService,
  ) {}

  async execute(refreshToken: string) {
    // =======================
    // 0. VALIDATE INPUT
    // =======================
    if (!refreshToken) {
      throw new InvalidTokenException();
    }

    // =======================
    // 1. VERIFY TOKEN
    // =======================
    const payload = await this.tokenPort.verifyRefreshToken(refreshToken);

    const { userId, sessionId, tokenVersion } = payload;

    // =======================
    // 2. GET USER 🔥
    // =======================
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new InvalidTokenException();
    }

    user.ensureActive();

    // 🔥 TOKEN VERSION CHECK
    if (user.tokenVersion !== tokenVersion) {
      throw new InvalidTokenException();
    }

    // =======================
    // 3. GET SESSION
    // =======================
    const session = await this.sessionRepo.findById(sessionId);

    if (!session) {
      throw new InvalidTokenException();
    }

    // =======================
    // 4. VALIDATE SESSION
    // =======================
    this.sessionService.validateSession(session);

    // =======================
    // 5. MATCH HASH 🔐
    // =======================
    const incomingHash = this.hash(refreshToken);

    if (incomingHash !== session.refreshTokenHash) {
      // 🔥 TOKEN REUSE DETECTED
      session.revoke('SECURITY');
      await this.sessionRepo.update(session);

      throw new InvalidTokenException();
    }

    // =======================
    // 6. GENERATE NEW TOKENS
    // =======================
    const newAccessToken = await this.tokenPort.generateAccessToken({
      userId,
      sessionId,
      tokenVersion,
      role: user.role, // 🔥 FIXED
    });

    const newRefreshToken = await this.tokenPort.generateRefreshToken({
      userId,
      sessionId,
      tokenVersion,
    });

    const newHash = this.hash(newRefreshToken);

    // =======================
    // 7. ROTATE SESSION 🔁
    // =======================
    this.sessionService.rotateSession(session, newHash);

    session.refreshTokenHash = newHash;

    this.sessionService.touch(session);

    await this.sessionRepo.update(session);

    // =======================
    // 8. RETURN
    // =======================
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  private hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex');
  }
}

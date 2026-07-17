import { Injectable, Inject } from '@nestjs/common';

import { SessionRepository } from '@/domain/repositories/session.repository';
import { SessionDomainService } from '@/domain/services/session.domain.service';

import { TOKENS } from '@/common/constants/tokens';

import { InvalidTokenException } from '@/domain/exceptions/token/invalid-token.exception';
import { SessionNotFoundException } from '@/domain/exceptions/session/session-not-found.exception';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,

    private readonly sessionService: SessionDomainService,
  ) {}

  async execute(user: { userId: string; sessionId: string }) {
    // =======================
    // 0. VALIDATE INPUT
    // =======================
    if (!user?.userId || !user?.sessionId) {
      throw new InvalidTokenException();
    }

    const { userId, sessionId } = user;

    // =======================
    // 1. GET SESSION
    // =======================
    const session = await this.sessionRepo.findById(sessionId);

    if (!session) {
      throw new SessionNotFoundException({ sessionId });
    }

    // =======================
    // 2. SECURITY CHECK 🔐
    // =======================
    if (session.userId !== userId) {
      throw new InvalidTokenException();
    }

    // =======================
    // 3. REVOKE (IDEMPOTENT)
    // =======================
    if (session.isActive()) {
      // optional: this.sessionService.validateSession(session);
      this.sessionService.revokeSession(session);
      await this.sessionRepo.update(session);
    }

    // =======================
    // 4. RETURN
    // =======================
    return {
      message: 'Logged out successfully',
      sessionId,
    };
  }
}

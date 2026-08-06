import { Injectable, Inject } from '@nestjs/common';

import { SessionRepository } from '@/domain/repositories/session.repository';
import { SessionDomainService } from '@/domain/services/session.domain.service';

import { TOKENS } from '@/common/constants/tokens';

import { InvalidTokenException } from '@/domain/exceptions/token/invalid-token.exception';
import { SessionNotFoundException } from '@/domain/exceptions/session/session-not-found.exception';
import { CannotLogoutCurrentSessionException } from '@/domain/exceptions/session/cannot-logout-current-session.exception';

@Injectable()
export class LogoutDeviceUseCase {
  constructor(
    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,

    private readonly sessionService: SessionDomainService,
  ) {}

  async execute(user: { userId: string; sessionId: string }, targetSessionId: string) {
    // =======================
    // 0. VALIDATE INPUT
    // =======================
    if (!user?.userId || !targetSessionId) {
      throw new InvalidTokenException();
    }

    const { userId, sessionId: currentSessionId } = user;

    // =======================
    // 1. GET TARGET SESSION
    // =======================
    const session = await this.sessionRepo.findById(targetSessionId);

    if (!session) {
      throw new SessionNotFoundException({
        sessionId: targetSessionId,
      });
    }

    // =======================
    // 2. SECURITY CHECK 🔐
    // =======================
    if (session.userId !== userId) {
      throw new InvalidTokenException();
    }

    // =======================
    // 3. PREVENT SELF LOGOUT
    // =======================
    if (session.id === currentSessionId) {
      throw new CannotLogoutCurrentSessionException({
        sessionId: session.id,
      });
    }

    // =======================
    // 4. REVOKE (ONLY IF ACTIVE)
    // =======================
    if (session.isActive()) {
      this.sessionService.revokeSession(session);
      await this.sessionRepo.update(session);
    }

    // =======================
    // 5. RETURN
    // =======================
    return {
      message: 'Device logged out successfully',
      sessionId: targetSessionId,
    };
  }
}

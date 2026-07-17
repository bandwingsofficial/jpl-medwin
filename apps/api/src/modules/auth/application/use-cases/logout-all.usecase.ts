import { Injectable, Inject } from '@nestjs/common';

import { SessionRepository } from '@/domain/repositories/session.repository';

import { TOKENS } from '@/common/constants/tokens';

@Injectable()
export class LogoutAllDevicesUseCase {
  constructor(
    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,
  ) {}

  async execute(user: { userId: string; sessionId: string }) {
    // =======================
    // 0. VALIDATE INPUT
    // =======================
    if (!user?.userId || !user?.sessionId) {
      return { message: 'Invalid session context' };
    }

    const { userId, sessionId } = user;

    // =======================
    // 1. REVOKE ALL EXCEPT CURRENT 🔥
    // =======================
    await this.sessionRepo.revokeAllExcept(userId, sessionId);

    // =======================
    // 2. RETURN
    // =======================
    return {
      message: 'Logged out from all other devices',
    };
  }
}

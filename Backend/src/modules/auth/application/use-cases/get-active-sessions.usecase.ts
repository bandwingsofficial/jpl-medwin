import { Injectable, Inject } from '@nestjs/common';

import { SessionRepository } from '@/domain/repositories/session.repository';

import { TOKENS } from '@/common/constants/tokens';

@Injectable()
export class GetActiveSessionsUseCase {
  constructor(
    @Inject(TOKENS.SESSION_REPO)
    private readonly sessionRepo: SessionRepository,
  ) {}

  async execute(user: { userId: string; sessionId: string }) {
    // =======================
    // 0. VALIDATE INPUT
    // =======================
    if (!user?.userId) {
      return [];
    }

    const { userId, sessionId } = user;

    // =======================
    // 1. GET ACTIVE SESSIONS (🔥 FIX)
    // =======================
    const sessions = await this.sessionRepo.findActiveByUserId(userId);

    // =======================
    // 2. MAP RESPONSE
    // =======================
    return sessions.map((s) => ({
      id: s.id,
      deviceId: s.deviceId,
      deviceName: s.deviceName,
      platform: s.platform,
      ipAddress: s.ipAddress,
      lastUsedAt: s.lastUsedAt,
      createdAt: s.createdAt,
      isCurrent: s.id === sessionId, // 🔥 important
    }));
  }
}

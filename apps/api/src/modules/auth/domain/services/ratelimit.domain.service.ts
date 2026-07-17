import { RATELIMIT_POLICY } from '../policies/ratelimit.policy';
import { RateLimitBlockedException } from '../exceptions/ratelimit/rate-limit-blocked.exception';

export class RateLimitDomainService {
  // =======================
  // PRIVATE HELPER
  // =======================

  private computeBlockedUntil(seconds: number): Date {
    const nowSec = Math.floor(Date.now() / 1000);
    return new Date((nowSec + seconds) * 1000);
  }

  // =======================
  // CHECK BLOCK (TTL BASED)
  // =======================

  ensureNotBlocked(params: {
    blockTtl: number; // seconds (Redis TTL)
    identifier?: string;
    purpose?: string;
  }): void {
    const { blockTtl, identifier, purpose } = params;

    if (blockTtl > 0) {
      throw new RateLimitBlockedException({
        identifier,
        purpose,
        retryAfter: blockTtl,
        blockedUntil: this.computeBlockedUntil(blockTtl),
      });
    }
  }

  // =======================
  // VALIDATE ATTEMPTS
  // =======================

  checkAttempts(params: {
    actionAttempts: number; // ✅ renamed
    identifier?: string;
    purpose?: string;
  }): void {
    const { actionAttempts, identifier, purpose } = params;

    if (actionAttempts >= RATELIMIT_POLICY.MAX_ATTEMPTS) {
      const blockSeconds = RATELIMIT_POLICY.BLOCK_DURATION_SECONDS;

      throw new RateLimitBlockedException({
        identifier,
        purpose,
        retryAfter: blockSeconds,
        blockedUntil: this.computeBlockedUntil(blockSeconds),
      });
    }
  }

  // =======================
  // SHOULD BLOCK
  // =======================

  shouldBlock(actionAttempts: number): boolean {
    return actionAttempts >= RATELIMIT_POLICY.MAX_ATTEMPTS;
  }

  // =======================
  // WINDOW RESET CHECK
  // =======================

  isWindowExpired(ttl: number): boolean {
    // Redis TTL <= 0 means expired or not set
    return ttl <= 0;
  }
}

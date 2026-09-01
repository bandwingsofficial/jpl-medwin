import { Injectable } from '@nestjs/common';
import { RedisService } from '@/infrastructure/redis/redis.service';

import { RateLimitStorePort } from '@/application/ports/rate-limit-store.port';
import { RATELIMIT_POLICY } from '@/domain/policies/ratelimit.policy';

@Injectable()
export class RedisRateLimitStore implements RateLimitStorePort {
  constructor(private readonly redis: RedisService) {}

  // =======================
  // KEYS
  // =======================

  private getCountKey(identifier: string): string {
    return `rl:count:${identifier}`;
  }

  private getBlockKey(identifier: string): string {
    return `rl:block:${identifier}`;
  }

  // =======================
  // GET ATTEMPTS
  // =======================

  async getAttempts(identifier: string): Promise<number> {
    const value = await this.redis.get(this.getCountKey(identifier));
    return value ? Number(value) : 0;
  }

  // =======================
  // INCREMENT ATTEMPTS
  // =======================

  async increment(identifier: string): Promise<number> {
    const key = this.getCountKey(identifier);

    const attempts = await this.redis.incr(key);

    const ttl = await this.redis.ttl(key);

    // 🔥 FIX: handle -1, -2, 0 cases
    if (ttl <= 0) {
      await this.redis.expire(key, RATELIMIT_POLICY.WINDOW_SECONDS);
    }

    return attempts;
  }

  // =======================
  // RESET ATTEMPTS
  // =======================

  async reset(identifier: string): Promise<void> {
    await this.redis.del(this.getCountKey(identifier));
  }

  // =======================
  // BLOCK USER
  // =======================

  async block(identifier: string): Promise<void> {
    const key = this.getBlockKey(identifier);

    const ttl = await this.redis.ttl(key);

    // 🔥 FIX: don't override existing block
    if (ttl > 0) return;

    await this.redis.set(key, '1', RATELIMIT_POLICY.BLOCK_DURATION_SECONDS);
  }

  // =======================
  // GET BLOCK TTL
  // =======================

  async getBlockTtl(identifier: string): Promise<number> {
    return this.redis.ttl(this.getBlockKey(identifier));
  }

  // =======================
  // IS BLOCKED (HELPER)
  // =======================

  async isBlocked(identifier: string): Promise<boolean> {
    const ttl = await this.getBlockTtl(identifier);
    return ttl > 0;
  }
}

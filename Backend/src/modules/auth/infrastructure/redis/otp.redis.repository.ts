import { Injectable } from '@nestjs/common';
import { RedisService } from '@/infrastructure/redis/redis.service';

import { OtpStorePort, OtpRecord, OtpData } from '@/application/ports/otp-store.port';

import { OTP_POLICY } from '@/domain/policies/otp.policy';

@Injectable()
export class RedisOtpStore implements OtpStorePort {
  constructor(private readonly redis: RedisService) {}

  // =======================
  // KEYS
  // =======================

  private getOtpKey(identifier: string): string {
    return `otp:${identifier}`;
  }

  private getAttemptsKey(identifier: string): string {
    return `otp:attempts:${identifier}`;
  }

  private getCooldownKey(identifier: string): string {
    return `otp:cooldown:${identifier}`;
  }

  // =======================
  // SAVE OTP
  // =======================

  async save(record: OtpRecord): Promise<void> {
    const otpKey = this.getOtpKey(record.identifier);
    const cooldownKey = this.getCooldownKey(record.identifier);

    const data = {
      code: record.code,
      expiresAt: new Date(Date.now() + record.expiresIn * 1000),
    };

    // 🔐 Store OTP
    await this.redis.set(otpKey, JSON.stringify(data), record.expiresIn);

    // ⏱ Cooldown
    await this.redis.set(cooldownKey, '1', OTP_POLICY.RESEND_COOLDOWN_SECONDS);

    // 🔄 Reset attempts on new OTP
    await this.redis.del(this.getAttemptsKey(record.identifier));
  }

  // =======================
  // GET OTP
  // =======================

  async get(identifier: string): Promise<OtpData | null> {
    const otpKey = this.getOtpKey(identifier);

    const raw = await this.redis.get(otpKey);
    if (!raw) return null;

    const attemptsRaw = await this.redis.get(this.getAttemptsKey(identifier));

    const attempts = attemptsRaw ? Number(attemptsRaw) : 0;

    try {
      const parsed = JSON.parse(raw);

      // 🔥 safety check
      if (!parsed.code || !parsed.expiresAt) {
        return null;
      }

      return {
        code: parsed.code,
        attempts,
        expiresAt: new Date(parsed.expiresAt),
      };
    } catch {
      return null;
    }
  }

  // =======================
  // DELETE OTP (FULL RESET)
  // =======================

  async delete(identifier: string): Promise<void> {
    await this.redis.del(this.getOtpKey(identifier));
    await this.redis.del(this.getAttemptsKey(identifier));
    await this.redis.del(this.getCooldownKey(identifier));
  }

  // =======================
  // INCREMENT ATTEMPTS
  // =======================

  async incrementAttempts(identifier: string): Promise<number> {
    const attemptsKey = this.getAttemptsKey(identifier);

    const attempts = await this.redis.incr(attemptsKey);

    const ttl = await this.redis.ttl(this.getOtpKey(identifier));

    if (ttl > 0) {
      // ⏱ sync attempts TTL with OTP TTL
      await this.redis.expire(attemptsKey, ttl);
    } else {
      // 🔥 OTP expired → clean stale attempts
      await this.redis.del(attemptsKey);
    }

    return attempts;
  }

  // =======================
  // GET COOLDOWN TTL
  // =======================

  async getCooldownTtl(identifier: string): Promise<number> {
    return this.redis.ttl(this.getCooldownKey(identifier));
  }
}

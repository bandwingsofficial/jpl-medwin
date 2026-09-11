import { Injectable } from '@nestjs/common';
import { RedisService } from '@/infrastructure/redis/redis.service';

export interface AdminChallengeData {
  challengeId: string;
  userId: string;
  identityId: string;
  email: string;
  otpHash: string;
  otpExpiresAt: number;
  emailOtpVerified: boolean;
  attempts: number;
  resendCount: number;
  lastSentAt: number;
  deviceId: string;
  deviceName?: string;
  platform?: string;
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class AdminChallengeStore {
  private readonly PREFIX = 'admin:auth:challenge:';

  constructor(private readonly redis: RedisService) {}

  private getKey(challengeId: string): string {
    return `${this.PREFIX}${challengeId}`;
  }

  async createChallenge(data: AdminChallengeData, ttlSeconds: number = 300): Promise<void> {
    const key = this.getKey(data.challengeId);
    await this.redis.setJson(key, data, ttlSeconds);
  }

  async getChallenge(challengeId: string): Promise<AdminChallengeData | null> {
    const key = this.getKey(challengeId);
    return this.redis.getJson<AdminChallengeData>(key);
  }

  async markEmailOtpVerified(challengeId: string, extendTtlSeconds: number = 300): Promise<void> {
    const key = this.getKey(challengeId);
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) return;

    challenge.emailOtpVerified = true;
    challenge.otpHash = ''; // Invalidate OTP hash to prevent replay

    await this.redis.setJson(key, challenge, extendTtlSeconds);
  }

  async updateOtp(
    challengeId: string,
    newOtpHash: string,
    otpExpiresAt: number,
    ttlSeconds: number = 300,
  ): Promise<void> {
    const key = this.getKey(challengeId);
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) return;

    challenge.otpHash = newOtpHash;
    challenge.otpExpiresAt = otpExpiresAt;
    challenge.lastSentAt = Date.now();
    challenge.resendCount += 1;
    challenge.attempts = 0; // Reset verification attempts on new OTP

    await this.redis.setJson(key, challenge, ttlSeconds);
  }

  async incrementAttempts(challengeId: string): Promise<number> {
    const key = this.getKey(challengeId);
    const challenge = await this.getChallenge(challengeId);
    if (!challenge) return 0;

    challenge.attempts = (challenge.attempts || 0) + 1;
    const ttl = await this.redis.ttl(key);
    await this.redis.setJson(key, challenge, ttl > 0 ? ttl : 300);

    return challenge.attempts;
  }

  async deleteChallenge(challengeId: string): Promise<void> {
    const key = this.getKey(challengeId);
    await this.redis.del(key);
  }
}

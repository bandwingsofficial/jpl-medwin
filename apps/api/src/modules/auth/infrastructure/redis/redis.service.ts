import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(
    @Inject(REDIS)
    private readonly redis: Redis,
  ) {}

  // =======================
  // GET
  // =======================

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  // =======================
  // SET
  // =======================

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds && ttlSeconds > 0) {
      await this.redis.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.redis.set(key, value);
    }
  }

  // =======================
  // DELETE (MULTI KEY)
  // =======================

  async del(...keys: string[]): Promise<void> {
    if (keys.length === 0) return;
    await this.redis.del(...keys);
  }

  // =======================
  // INCREMENT
  // =======================

  async incr(key: string): Promise<number> {
    return this.redis.incr(key);
  }

  // =======================
  // EXPIRE
  // =======================

  async expire(key: string, ttl: number): Promise<void> {
    await this.redis.expire(key, ttl);
  }

  // =======================
  // TTL
  // =======================

  async ttl(key: string): Promise<number> {
    const ttl = await this.redis.ttl(key);

    if (ttl === -2) return 0; // key not found
    if (ttl === -1) return 0; // no expiry

    return ttl;
  }

  // =======================
  // EXISTS
  // =======================

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }

  // =======================
  // JSON HELPERS (OPTIONAL)
  // =======================

  async setJson(key: string, value: any, ttlSeconds?: number): Promise<void> {
    await this.set(key, JSON.stringify(value), ttlSeconds);
  }

  async getJson<T>(key: string): Promise<T | null> {
    const raw = await this.get(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }
}

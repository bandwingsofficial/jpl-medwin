import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: () => {
        const client = new Redis({
          host: process.env.REDIS_HOST || '127.0.0.1',
          port: Number(process.env.REDIS_PORT || 6379),
          password: process.env.REDIS_PASSWORD || undefined,
          maxRetriesPerRequest: 3,
          enableReadyCheck: false,
          retryStrategy(times) {
            return Math.min(times * 200, 3000);
          },
        });

        client.on('error', (err) => {
          // Gracefully log warning without throwing unhandled error events
          console.warn('[Auth Redis] Connection warning:', err.message || err);
        });

        return client;
      },
    },
    RedisService,
  ],
  exports: [REDIS, RedisService],
})
export class RedisModule {}

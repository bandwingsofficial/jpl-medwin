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
        return new Redis({
          host: process.env.REDIS_HOST!,
          port: Number(process.env.REDIS_PORT),
          password: process.env.REDIS_PASSWORD!,
          maxRetriesPerRequest: null,
          enableReadyCheck: true,
        });
      },
    },
    RedisService,
  ],
  exports: [REDIS, RedisService],
})
export class RedisModule {}

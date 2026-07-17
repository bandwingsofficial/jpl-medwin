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
        return new Redis(process.env.REDIS_URL!, {
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

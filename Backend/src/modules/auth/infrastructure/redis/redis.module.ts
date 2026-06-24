import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';

import { REDIS } from './redis.constants';
import { RedisService } from './redis.service';

@Global() // ✅ makes it available everywhere
@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: () => {
        return new Redis({
          host: 'localhost',
          port: 6379,
        });
      },
    },
    RedisService,
  ],
  exports: [REDIS, RedisService], // ✅ export both
})
export class RedisModule {}

import { Module } from '@nestjs/common';

import { RobotsService } from './application/services/robots.service';

import { RobotsController } from './presentation/controllers/robots.controller';

@Module({
  controllers: [
    RobotsController,
  ],

  providers: [
    RobotsService,
  ],

  exports: [
    RobotsService,
  ],
})
export class RobotsModule {}
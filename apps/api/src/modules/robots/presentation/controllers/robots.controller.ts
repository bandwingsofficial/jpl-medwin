import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { RobotsService } from '../../application/services/robots.service';

@Controller()
export class RobotsController {
  constructor(
    private readonly robotsService: RobotsService,
  ) {}

  @Get('robots.txt')
  getRobots(
    @Res() response: Response,
  ): void {
    const robots = this.robotsService.generate();

    response
      .status(200)
      .type('text/plain')
      .send(robots);
  }
}
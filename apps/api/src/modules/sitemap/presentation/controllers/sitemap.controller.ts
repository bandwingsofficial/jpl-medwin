import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';

import type { Response } from 'express';

import { SitemapService } from '../../application/services/sitemap.service';

@Controller()
export class SitemapController {
  constructor(
    private readonly sitemapService: SitemapService,
  ) {}

  @Get('sitemap.xml')
  async getSitemap(
    @Res() response: Response,
  ): Promise<void> {
    const xml = await this.sitemapService.generate();

    response
      .status(200)
      .type('application/xml')
      .send(xml);
  }
}
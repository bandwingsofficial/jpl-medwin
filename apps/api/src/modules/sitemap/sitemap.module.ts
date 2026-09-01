import { Module } from '@nestjs/common';

import { PrismaService } from '../../infrastructure/prisma/prisma.service';

import { SitemapService } from './application/services/sitemap.service';

import { SitemapController } from './presentation/controllers/sitemap.controller';

@Module({
  controllers: [
    SitemapController,
  ],

  providers: [
    PrismaService,
    SitemapService,
  ],

  exports: [
    SitemapService,
  ],
})
export class SitemapModule {}
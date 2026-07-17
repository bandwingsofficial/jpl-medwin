// src/modules/search/search.module.ts

import { Module } from '@nestjs/common';

// =======================
// CONTROLLERS
// =======================

import { SearchController } from './presentation/controllers/search.controller';

// =======================
// USE CASES
// =======================

import { GlobalSearchUseCase } from './application/use-cases/global-search.use-case';

// =======================
// APPLICATION SERVICES
// =======================

import { SearchBuilderService } from './application/services/search-builder.service';
import { SearchRankingService } from './application/services/search-ranking.service';

// =======================
// PORTS (TOKENS)
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// ADAPTERS (PRISMA REPO)
// =======================

import { PrismaSearchRepository } from './infrastructure/persistence/prisma/repositories/prisma-search.repository';

// =======================
// MODULES
// =======================

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule],

  controllers: [SearchController],

  providers: [
    // =======================
    // USE CASES
    // =======================

    GlobalSearchUseCase,

    // =======================
    // APPLICATION SERVICES
    // =======================

    SearchBuilderService,
    SearchRankingService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.SEARCH_REPOSITORY,
      useClass: PrismaSearchRepository,
    },
  ],

  exports: [TOKENS.SEARCH_REPOSITORY],
})
export class SearchModule {}

// src/modules/wishlist/wishlist.module.ts

import { Module } from '@nestjs/common';

// =======================
// INFRA
// =======================

import { PrismaService } from '../../infrastructure/prisma/prisma.service';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLER
// =======================

import { WishlistController } from './presentation/controllers/wishlist.controller';

// =======================
// REPOSITORY
// =======================

import { PrismaWishlistRepository } from './infrastructure/persistence/prisma/repositories/prisma-wishlist.repository';

// =======================
// USE CASES
// =======================

import { AddToWishlistUseCase } from './application/use-cases/add-to-wishlist.use-case';

import { RemoveFromWishlistUseCase } from './application/use-cases/remove-from-wishlist.use-case';

import { GetWishlistUseCase } from './application/use-cases/get-wishlist.use-case';

import { GetWishlistCountUseCase } from './application/use-cases/get-wishlist-count.use-case';

// =======================
// MODULES
// =======================

import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],

  controllers: [WishlistController],

  providers: [
    PrismaService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.WISHLIST_REPO,

      useClass: PrismaWishlistRepository,
    },

    // =======================
    // USE CASES
    // =======================

    AddToWishlistUseCase,

    RemoveFromWishlistUseCase,

    GetWishlistUseCase,

    GetWishlistCountUseCase,
  ],

  exports: [
    TOKENS.WISHLIST_REPO,

    AddToWishlistUseCase,

    RemoveFromWishlistUseCase,

    GetWishlistUseCase,

    GetWishlistCountUseCase,
  ],
})
export class WishlistModule {}

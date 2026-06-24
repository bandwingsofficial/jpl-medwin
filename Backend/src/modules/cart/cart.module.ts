// src/modules/cart/cart.module.ts

import { Module, forwardRef } from '@nestjs/common';

// =======================
// INFRA
// =======================

import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { CouponModule } from '../coupon/coupon.module';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLERS
// =======================

import { CartController } from './presentation/controllers/cart.controller';

// =======================
// REPOSITORIES
// =======================

import { PrismaCartRepository } from './infrastructure/persistence/prisma/repositories/prisma-cart.repository';

import { PrismaCartItemRepository } from './infrastructure/persistence/prisma/repositories/prisma-cart-item.repository';

// =======================
// DOMAIN SERVICES
// =======================

import { CartDomainService } from './domain/services/cart-domain.service';

// =======================
// APPLICATION SERVICES
// =======================

import { CartSummaryService } from './application/services/cart-summary.service';

import { CartOwnershipService } from './application/services/cart-ownership.service';

import { CartMergeService } from './application/services/cart-merge.service';

// =======================
// USE CASES
// =======================

import { AddToCartUseCase } from './application/use-cases/add-to-cart.use-case';

import { GetCartUseCase } from './application/use-cases/get-cart.use-case';

import { UpdateCartItemQuantityUseCase } from './application/use-cases/update-cart-item-quantity.use-case';

import { RemoveCartItemUseCase } from './application/use-cases/remove-cart-item.use-case';

import { ClearCartUseCase } from './application/use-cases/clear-cart.use-case';

import { UnlockCartUseCase } from './application/use-cases/unlock-cart.use-case';

import { LockCartUseCase } from './application/use-cases/lock-cart.use-case';

import { ConvertCartUseCase } from './application/use-cases/assign-guest-cart-to-user.use-case';

import { MergeCartUseCase } from './application/use-cases/merge-cart.use-case';

import { ApplyCouponUseCase } from './application/use-cases/apply-coupon.use-case';

import { RemoveCouponUseCase } from './application/use-cases/remove-coupon.use-case';

// =======================
// PRODUCT MODULE
// =======================

import { ProductModule } from '../product/product.module';

@Module({
 imports: [forwardRef(() => ProductModule), CouponModule],

  controllers: [CartController],

  providers: [
    PrismaService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.CART_REPO,

      useClass: PrismaCartRepository,
    },

    {
      provide: TOKENS.CART_ITEM_REPO,

      useClass: PrismaCartItemRepository,
    },

    // =======================
    // DOMAIN SERVICES
    // =======================

    CartDomainService,

    // =======================
    // APP SERVICES
    // =======================

    CartSummaryService,

    CartOwnershipService,

    CartMergeService,

    // =======================
    // USE CASES
    // =======================

    AddToCartUseCase,

    GetCartUseCase,

    UpdateCartItemQuantityUseCase,

    RemoveCartItemUseCase,

    ClearCartUseCase,

    LockCartUseCase,

    UnlockCartUseCase,

    MergeCartUseCase,

    ConvertCartUseCase,

    ApplyCouponUseCase,

    RemoveCouponUseCase,
  ],

  exports: [
    // =======================
    // REPOSITORIES
    // =======================

    TOKENS.CART_REPO,

    TOKENS.CART_ITEM_REPO,

    // =======================
    // DOMAIN SERVICES
    // =======================

    CartDomainService,

    // =======================
    // APP SERVICES
    // =======================

    CartSummaryService,

    // =======================
    // USE CASES
    // =======================

    AddToCartUseCase,

    GetCartUseCase,

    UpdateCartItemQuantityUseCase,

    RemoveCartItemUseCase,

    ClearCartUseCase,

    LockCartUseCase,

    UnlockCartUseCase,

    MergeCartUseCase,

    ConvertCartUseCase,

    ApplyCouponUseCase,

    RemoveCouponUseCase,
  ],
})
export class CartModule {}

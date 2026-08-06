// src/modules/checkout-session/checkout-session.module.ts

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
// CONTROLLERS
// =======================

import { CheckoutSessionController } from './presentation/controllers/checkout-session.controller';

// =======================
// REPOSITORIES
// =======================

import { PrismaCheckoutSessionRepository } from './infrastructure/persistence/prisma/repositories/prisma-checkout-session.repository';

import { PrismaCheckoutSessionItemRepository } from './infrastructure/persistence/prisma/repositories/prisma-checkout-session-item.repository';

// =======================
// DOMAIN SERVICES
// =======================

import { CheckoutSessionDomainService } from './domain/services/checkout-session-domain.service';

// =======================
// APPLICATION SERVICES
// =======================

import { CheckoutSessionSummaryService } from './application/services/checkout-session-summary.service';

import { CheckoutSessionOwnershipService } from './application/services/checkout-session-ownership.service';

// =======================
// USE CASES
// =======================

import { CreateCheckoutSessionUseCase } from './application/use-cases/create-checkout-session.use-case';

import { GetCheckoutSessionUseCase } from './application/use-cases/get-checkout-session.use-case';

import { ExpireCheckoutSessionUseCase } from './application/use-cases/expire-checkout-session.use-case';

import { CompleteCheckoutSessionUseCase } from './application/use-cases/complete-checkout-session.use-case';

import { ApplyRewardsToCheckoutUseCase } from './application/use-cases/apply-rewards-to-checkout.use-case';

import { RemoveRewardsFromCheckoutUseCase } from './application/use-cases/remove-rewards-from-checkout.use-case';

// =======================
// IMPORTS
// =======================

import { ProductModule } from '../product/product.module';

import { CoinsModule } from '../coins/coins.module';
import { ShippingConfigurationModule } from '../shipping-configuration/shipping-configuration.module';

import { CartModule } from '../cart/cart.module';

@Module({
  imports: [ProductModule, CartModule, CoinsModule, ShippingConfigurationModule],

  controllers: [CheckoutSessionController],

  providers: [
    PrismaService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.CHECKOUT_SESSION_REPO,

      useClass: PrismaCheckoutSessionRepository,
    },

    {
      provide: TOKENS.CHECKOUT_SESSION_ITEM_REPO,

      useClass: PrismaCheckoutSessionItemRepository,
    },

    // =======================
    // DOMAIN SERVICES
    // =======================

    CheckoutSessionDomainService,

    // =======================
    // APPLICATION SERVICES
    // =======================

    CheckoutSessionSummaryService,

    CheckoutSessionOwnershipService,

    // =======================
    // USE CASES
    // =======================

    CreateCheckoutSessionUseCase,

    GetCheckoutSessionUseCase,

    ApplyRewardsToCheckoutUseCase,

    RemoveRewardsFromCheckoutUseCase,

    ExpireCheckoutSessionUseCase,

    CompleteCheckoutSessionUseCase,
  ],

  exports: [
    // =======================
    // REPOSITORIES
    // =======================

    TOKENS.CHECKOUT_SESSION_REPO,

    TOKENS.CHECKOUT_SESSION_ITEM_REPO,

    // =======================
    // DOMAIN SERVICES
    // =======================

    CheckoutSessionDomainService,

    // =======================
    // APPLICATION SERVICES
    // =======================

    CheckoutSessionSummaryService,

    CheckoutSessionOwnershipService,

    // =======================
    // USE CASES
    // =======================

    CreateCheckoutSessionUseCase,

    GetCheckoutSessionUseCase,

    ApplyRewardsToCheckoutUseCase,

    RemoveRewardsFromCheckoutUseCase,

    ExpireCheckoutSessionUseCase,

    CompleteCheckoutSessionUseCase,
  ],
})
export class CheckoutSessionModule {}

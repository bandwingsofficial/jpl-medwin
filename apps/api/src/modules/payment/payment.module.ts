// src/modules/payment/payment.module.ts

import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// INFRA
// =======================

import { PrismaService } from '../../infrastructure/prisma/prisma.service';

// =======================
// IMPORTS
// =======================

import { OrderModule } from '@/modules/order/order.module';

// =======================
// CONTROLLERS
// =======================

import { PaymentController } from './presentation/controllers/payment.controller';

import { PaymentWebhookController } from './presentation/controllers/payment-webhook.controller';

// =======================
// USE CASES
// =======================

import { CreatePaymentUseCase } from './application/use-cases/create-payment.use-case';

import { VerifyPaymentUseCase } from './application/use-cases/verify-payment.use-case';

import { HandlePaymentSuccessUseCase } from './application/use-cases/handle-payment-success.use-case';

import { HandlePaymentFailureUseCase } from './application/use-cases/handle-payment-failure.use-case';

import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';

import { HandleWebhookUseCase } from './application/use-cases/handle-webhook.use-case';

// =======================
// SERVICES
// =======================

import { RazorpayService } from './application/services/razorpay.service';

import { StripeService } from './application/services/stripe.service';

import { PaymentWebhookService } from './application/services/payment-webhook.service';

// =======================
// DOMAIN SERVICES
// =======================

import { PaymentDomainService } from './domain/services/payment-domain.service';

// =======================
// REPOSITORIES
// =======================

import { PrismaPaymentRepository } from './infrastructure/persistence/prisma/repositories/prisma-payment.repository';

import { CheckoutSessionModule } from '@/modules/checkout-session/checkout-session.module';

import { CoinsModule } from '@/modules/coins/coins.module';

@Module({
  imports: [ConfigModule, OrderModule, CheckoutSessionModule, CoinsModule],

  controllers: [PaymentController, PaymentWebhookController],

  providers: [
    PrismaService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.PAYMENT_REPO,

      useClass: PrismaPaymentRepository,
    },

    // =======================
    // DOMAIN SERVICES
    // =======================

    PaymentDomainService,

    // =======================
    // PROVIDER SERVICES
    // =======================

    RazorpayService,

    StripeService,

    PaymentWebhookService,

    // =======================
    // USE CASES
    // =======================

    CreatePaymentUseCase,

    VerifyPaymentUseCase,

    HandlePaymentSuccessUseCase,

    HandlePaymentFailureUseCase,

    RefundPaymentUseCase,

    HandleWebhookUseCase,
  ],

  exports: [
    // =======================
    // REPOSITORIES
    // =======================

    TOKENS.PAYMENT_REPO,

    // =======================
    // DOMAIN SERVICES
    // =======================

    PaymentDomainService,

    // =======================
    // USE CASES
    // =======================

    CreatePaymentUseCase,

    VerifyPaymentUseCase,

    HandlePaymentSuccessUseCase,

    HandlePaymentFailureUseCase,

    RefundPaymentUseCase,

    HandleWebhookUseCase,
  ],
})
export class PaymentModule {}

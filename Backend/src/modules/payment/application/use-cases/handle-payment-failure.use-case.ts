// src/modules/payment/application/use-cases/handle-payment-failure.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Payment } from '../../domain/entities/payment.entity';

import { PaymentRepository } from '../../domain/repositories/payment.repository';

import { PaymentDomainService } from '../../domain/services/payment-domain.service';

import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';

@Injectable()
export class HandlePaymentFailureUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    private readonly paymentDomainService: PaymentDomainService,
  ) {}

  async execute(input: {
    paymentId?: string;

    providerPaymentId?: string;

    failureCode?: string;

    failureReason?: string;

    webhookEvent?: string;

    webhookPayload?: Record<string, any>;
  }) {
    // =======================
    // 🔍 FIND PAYMENT
    // =======================

    let payment: Payment | null = null;

    // by internal id
    if (input.paymentId) {
      payment = await this.paymentRepo.findById(input.paymentId);
    }

    // by provider payment id
    else if (input.providerPaymentId) {
      payment = await this.paymentRepo.findByProviderPaymentId(input.providerPaymentId);
    }

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!payment) {
      throw new PaymentNotFoundException({
        paymentId: input.paymentId,

        providerPaymentId: input.providerPaymentId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.paymentDomainService.ensurePaymentUsable(payment);

    // =======================
    // 📄 STORE WEBHOOK
    // =======================

    payment.storeWebhook({
      event: input.webhookEvent,

      payload: input.webhookPayload,
    });

    // =======================
    // ❌ FAIL PAYMENT
    // =======================

    this.paymentDomainService.ensureCanFail(payment);

    payment.fail({
      code: input.failureCode,

      reason: input.failureReason,
    });

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.paymentRepo.update(payment);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      message: 'Payment marked failed',

      data: {
        id: updated.id,

        orderId: updated.orderId,

        provider: updated.provider,

        status: updated.status,

        amount: updated.amount,

        failureCode: updated.failureCode,

        failureReason: updated.failureReason,

        retryCount: updated.retryCount,

        failedAt: updated.failedAt,

        updatedAt: updated.updatedAt,
      },
    };
  }
}

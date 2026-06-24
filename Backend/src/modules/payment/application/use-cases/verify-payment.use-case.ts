// src/modules/payment/application/use-cases/verify-payment.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { TOKENS } from '@/common/constants/tokens';

import { PaymentRepository } from '../../domain/repositories/payment.repository';

import { PaymentDomainService } from '../../domain/services/payment-domain.service';

import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';

import { PaymentFailedException } from '../../domain/exceptions/payment-failed.exception';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { RazorpayService } from '../services/razorpay.service';

import { MarkOrderPaidUseCase } from '@/modules/order/application/use-cases/mark-order-paid.use-case';

@Injectable()
export class VerifyPaymentUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    private readonly paymentDomainService: PaymentDomainService,

    private readonly razorpayService: RazorpayService,

    private readonly configService: ConfigService,

    private readonly markOrderPaidUseCase: MarkOrderPaidUseCase,
  ) {}

  async execute(input: {
    paymentId: string;

    providerPaymentId: string;

    providerSignature?: string;
  }) {
    // =======================
    // 🔍 FIND PAYMENT
    // =======================

    const payment =
      await this.paymentRepo.findById(
        input.paymentId,
      );

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!payment) {
      throw new PaymentNotFoundException({
        paymentId: input.paymentId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.paymentDomainService.ensurePaymentUsable(
      payment,
    );

    // =======================
    // 🔐 VERIFY SIGNATURE
    // =======================

    let verified = false;

    // =======================
    // 🟦 RAZORPAY
    // =======================

    if (
      payment.provider ===
      PaymentProvider.RAZORPAY
    ) {
      const secret =
        this.configService.get<string>(
          'RAZORPAY_KEY_SECRET',
        ) ?? '';

      verified =
        this.razorpayService.verifySignature({
          orderId:
            payment.providerOrderId ?? '',

          paymentId:
            input.providerPaymentId,

          signature:
            input.providerSignature ?? '',

          secret,
        });
    }

    // =======================
    // 🟪 STRIPE
    // =======================

    else if (
      payment.provider ===
      PaymentProvider.STRIPE
    ) {
      /*
       |------------------------------------------
       | TODO
       |------------------------------------------
       | Implement Stripe webhook/payment
       | verification later
       |------------------------------------------
       */

      verified = true;
    }

    // =======================
    // ❌ INVALID SIGNATURE
    // =======================

    if (!verified) {
      payment.fail({
        code: 'INVALID_SIGNATURE',

        reason:
          'Payment signature verification failed',
      });

      await this.paymentRepo.update(
        payment,
      );

      throw new PaymentFailedException({
        paymentId: payment.id,

        provider: payment.provider,

        reason:
          'Invalid payment signature',
      });
    }

    // =======================
    // ✅ AUTHORIZE
    // =======================

    this.paymentDomainService.ensureCanAuthorize(
      payment,
    );

    payment.authorize({
      paymentId:
        input.providerPaymentId,

      signature:
        input.providerSignature,
    });

    // =======================
    // ✅ CAPTURE
    // =======================

    this.paymentDomainService.ensureCanCapture(
      payment,
    );

    payment.capture({
      paymentId:
        input.providerPaymentId,
    });

    // =======================
    // 💾 SAVE PAYMENT
    // =======================

    const updated =
      await this.paymentRepo.update(
        payment,
      );

    // =======================
    // ✅ UPDATE ORDER
    // =======================

    await this.markOrderPaidUseCase.execute({
      orderId: payment.orderId,
    });

    

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
  id: updated.id,

  orderId: updated.orderId,

  provider: updated.provider,

  status: updated.status,

  amount: updated.amount,

  providerOrderId:
    updated.providerOrderId,

  providerPaymentId:
    updated.providerPaymentId,

  authorizedAt:
    updated.authorizedAt,

  capturedAt:
    updated.capturedAt,

  updatedAt:
    updated.updatedAt,
};
  }
}
// src/modules/payment/application/use-cases/refund-payment.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Payment } from '../../domain/entities/payment.entity';

import { PaymentRepository } from '../../domain/repositories/payment.repository';

import { PaymentDomainService } from '../../domain/services/payment-domain.service';

import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { RazorpayService } from '../services/razorpay.service';

import { StripeService } from '../services/stripe.service';

import { RefundOrderUseCase } from '@/modules/order/application/use-cases/refund-order.use-case';

@Injectable()
export class RefundPaymentUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    private readonly paymentDomainService: PaymentDomainService,

    private readonly razorpayService: RazorpayService,

    private readonly stripeService: StripeService,

    private readonly refundOrderUseCase: RefundOrderUseCase,
  ) {}

  async execute(input: {
    paymentId: string;

    amount: number;
  }) {
    // =======================
    // 🔍 FIND PAYMENT
    // =======================

    const payment = await this.paymentRepo.findById(input.paymentId);

    if (!payment) {
      throw new PaymentNotFoundException({
        paymentId: input.paymentId,
      });
    }

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.paymentDomainService.ensurePaymentUsable(payment);

    this.paymentDomainService.ensureCanRefund(payment, input.amount);

    // =======================
    // 💸 PROVIDER REFUND
    // =======================

    let refundResponse: Record<string, any> | undefined;

    let refundId: string | undefined;

    // =======================
    // 🟦 RAZORPAY
    // =======================

    if (payment.provider === PaymentProvider.RAZORPAY) {
      refundResponse = await this.razorpayService.refundPayment({
        paymentId: payment.providerPaymentId ?? '',

        amount: input.amount,
      });

      refundId = refundResponse.id;
    }

    // =======================
    // 🟪 STRIPE
    // =======================
    else if (payment.provider === PaymentProvider.STRIPE) {
      refundResponse = await this.stripeService.refundPayment({
        paymentIntentId: payment.providerPaymentId ?? '',

        amount: input.amount,
      });

      refundId = refundResponse.id;
    }

    // =======================
    // 💸 REFUND ENTITY
    // =======================

    payment.refund({
      amount: input.amount,

      refundId,
    });

    // =======================
    // 💾 SAVE PAYMENT
    // =======================

    const updated = await this.paymentRepo.update(payment);

    // =======================
    // 🔄 UPDATE ORDER
    // =======================

    await this.refundOrderUseCase.execute({
      orderId: payment.orderId,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      message: 'Payment refunded successfully',

      data: {
        id: updated.id,

        orderId: updated.orderId,

        provider: updated.provider,

        status: updated.status,

        amount: updated.amount,

        refundedAmount: updated.refundedAmount,

        providerRefundId: updated.providerRefundId,

        refundResponse,

        refundedAt: updated.refundedAt,

        updatedAt: updated.updatedAt,
      },
    };
  }
}

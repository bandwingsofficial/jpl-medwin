// src/modules/payment/application/use-cases/handle-payment-success.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { PaymentRepository } from '../../domain/repositories/payment.repository';

import { PaymentDomainService } from '../../domain/services/payment-domain.service';

import { PaymentNotFoundException } from '../../domain/exceptions/payment-not-found.exception';

import { Payment } from '../../domain/entities/payment.entity';

import { MarkOrderPaidUseCase } from '@/modules/order/application/use-cases/mark-order-paid.use-case';
import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';
import { CheckoutSessionRepository } from '@/modules/checkout-session/domain/repositories/checkout-session.repository';

import { RedeemCoinsUseCase } from '@/modules/coins/application/use-cases/redemption/redeem-coins.use-case';
@Injectable()
export class HandlePaymentSuccessUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    private readonly redeemCoinsUseCase: RedeemCoinsUseCase,

    private readonly paymentDomainService: PaymentDomainService,

    private readonly markOrderPaidUseCase: MarkOrderPaidUseCase,
  ) {}

  async execute(input: {
    paymentId?: string;

    providerPaymentId?: string;

    providerSignature?: string;

    webhookEvent?: string;

    webhookPayload?: Record<string, any>;
  }) {
    // =======================
    // 🔍 FIND PAYMENT
    // =======================

    let payment: Payment | null = null;

    // by internal payment id
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
    // 🔐 AUTHORIZE
    // =======================

    this.paymentDomainService.ensureCanAuthorize(payment);

    payment.authorize({
      paymentId: input.providerPaymentId,

      signature: input.providerSignature,
    });

    // =======================
    // 💰 CAPTURE
    // =======================

    this.paymentDomainService.ensureCanCapture(payment);

    payment.capture({
      paymentId: input.providerPaymentId,
    });

    // =======================
    // 💾 SAVE PAYMENT
    // =======================

    const updated = await this.paymentRepo.update(payment);

    // =======================
    // ✅ UPDATE ORDER
    // =======================

    await this.markOrderPaidUseCase.execute({
      orderId: payment.orderId,
    });

    // =======================
    // 🪙 REDEEM COINS
    // =======================

    const order = await this.orderRepo.findById(payment.orderId);

    if (order && order.redeemedCoins > 0 && order.redeemedAmount > 0) {
      await this.redeemCoinsUseCase.execute({
        userId: order.userId,

        orderId: order.id,

        coins: order.redeemedCoins,

        orderAmount: order.grandTotal + order.redeemedAmount,

        metadata: {
          orderNumber: order.orderNumber,
        },
      });
    }

    // =======================
    // ✅ COMPLETE CHECKOUT
    // =======================

    if (order?.checkoutSessionId) {
      const session = await this.checkoutSessionRepo.findById(order.checkoutSessionId);

      if (session) {
        session.complete();

        await this.checkoutSessionRepo.update(session);
      }
    }

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      message: 'Payment marked successful',

      data: {
        id: updated.id,

        orderId: updated.orderId,

        provider: updated.provider,

        status: updated.status,

        amount: updated.amount,

        providerOrderId: updated.providerOrderId,

        providerPaymentId: updated.providerPaymentId,

        authorizedAt: updated.authorizedAt,

        capturedAt: updated.capturedAt,

        updatedAt: updated.updatedAt,
      },
    };
  }
}

// src/modules/payment/application/use-cases/create-payment.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Payment } from '../../domain/entities/payment.entity';

import { PaymentRepository } from '../../domain/repositories/payment.repository';

import { PaymentDomainService } from '../../domain/services/payment-domain.service';

import { PaymentProvider } from '../../domain/enums/payment-provider.enum';

import { PaymentStatus } from '../../domain/enums/payment-status.enum';

import { RazorpayService } from '../services/razorpay.service';

import { StripeService } from '../services/stripe.service';

import { OrderRepository } from '@/modules/order/domain/repositories/order.repository';

import { OrderNotFoundException } from '@/modules/order/domain/exceptions/order-not-found.exception';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(TOKENS.PAYMENT_REPO)
    private readonly paymentRepo: PaymentRepository,

    @Inject(TOKENS.ORDER_REPO)
    private readonly orderRepo: OrderRepository,

    private readonly paymentDomainService: PaymentDomainService,

    private readonly razorpayService: RazorpayService,

    private readonly stripeService: StripeService,
  ) {}

  async execute(input: {
    orderId: string;

    provider: PaymentProvider;
  }) {
    // =======================
    // 🔍 FIND ORDER
    // =======================

    const order =
      await this.orderRepo.findById(
        input.orderId,
      );

    if (!order) {
      throw new OrderNotFoundException({
        orderId: input.orderId,
      });
    }

    // =======================
    // 💳 CREATE PAYMENT ENTITY
    // =======================

    const payment = new Payment({
      orderId: order.id,

      provider: input.provider,

      // INTERNAL SYSTEM STORES INR
      amount: order.grandTotal,

      currency: 'INR',

      status: PaymentStatus.PENDING,

      metadata: {
        orderNumber:
          order.orderNumber,
      },
    });

    // =======================
    // 🛡 VALIDATE
    // =======================

    this.paymentDomainService.ensureCanCreate(
      payment,
    );

    // =======================
    // 💳 PROVIDER ORDER
    // =======================

    let providerOrderId:
      | string
      | undefined;

    let providerResponse:
      | Record<string, any>
      | undefined;

    // =======================
    // 🟦 RAZORPAY
    // =======================

    if (
      input.provider ===
      PaymentProvider.RAZORPAY
    ) {
      const razorpayOrder =
        await this.razorpayService.createOrder(
          {
            // SEND INR
            // SERVICE WILL CONVERT TO PAISE
            amount:
              order.grandTotal,

            currency: 'INR',

            receipt:
              order.orderNumber,

            notes: {
              orderId: order.id,
            },
          },
        );

      providerOrderId =
        razorpayOrder.id;

      providerResponse =
        razorpayOrder;
    }

    // =======================
    // 🟪 STRIPE
    // =======================

    else if (
      input.provider ===
      PaymentProvider.STRIPE
    ) {
      const paymentIntent =
        await this.stripeService.createPaymentIntent(
          {
            amount:
              order.grandTotal,

            currency: 'INR',

            metadata: {
              orderId: order.id,
            },
          },
        );

      providerOrderId =
        paymentIntent.id;

      providerResponse =
        paymentIntent;
    }

    // =======================
    // 🏗 MARK CREATED
    // =======================

    payment.markCreated({
      providerOrderId,
    });

    // =======================
    // 💾 SAVE
    // =======================

    const created =
      await this.paymentRepo.create(
        payment,
      );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: created.id,

      orderId: created.orderId,

      provider: created.provider,

      status: created.status,

      // RETURN INR TO FRONTEND
      amount: created.amount,

      currency: created.currency,

      providerOrderId:
        created.providerOrderId,

      providerResponse,

      createdAt:
        created.createdAt,
    };
  }
}
// src/modules/payment/application/services/stripe.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  // =======================
  // 🏗 CREATE PAYMENT INTENT
  // =======================

  async createPaymentIntent(input: {
    amount: number;

    currency?: string;

    metadata?: Record<string, any>;
  }) {
    // 🔥 TEMP MOCK

    return {
      id: 'pi_' + Date.now(),

      clientSecret: 'secret_' + Date.now(),

      amount: Math.round(input.amount * 100),

      currency: input.currency ?? 'inr',

      metadata: input.metadata ?? {},
    };
  }

  // =======================
  // 💸 REFUND
  // =======================

  async refundPayment(input: {
    paymentIntentId: string;

    amount?: number;
  }) {
    // 🔥 TEMP MOCK

    return {
      id: 'refund_' + Date.now(),

      paymentIntentId: input.paymentIntentId,

      amount: input.amount,

      status: 'succeeded',
    };
  }
}

// src/modules/payment/application/services/razorpay.service.ts

import { Injectable } from '@nestjs/common';

import * as crypto from 'crypto';

import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;

  constructor() {
    this.razorpay = new Razorpay({
      key_id:
        process.env
          .RAZORPAY_KEY_ID ?? '',

      key_secret:
        process.env
          .RAZORPAY_KEY_SECRET ??
        '',
    });
  }

  // =======================
  // 🏗 CREATE ORDER
  // =======================

  async createOrder(input: {
    amount: number;

    currency?: string;

    receipt: string;

    notes?: Record<string, any>;
  }) {
    /*
     |--------------------------------------------------
     | Razorpay expects amount in PAISE
     |
     | ₹500 => 50000
     |--------------------------------------------------
     */

    const razorpayOrder =
      await this.razorpay.orders.create({
        amount: Math.round(
          input.amount * 100,
        ),

        currency:
          input.currency ?? 'INR',

        receipt: input.receipt,

        notes: input.notes ?? {},
      });

    return razorpayOrder;
  }

  // =======================
  // 🔐 VERIFY SIGNATURE
  // =======================

  verifySignature(input: {
    orderId: string;

    paymentId: string;

    signature: string;

    secret: string;
  }): boolean {
    const body = `${input.orderId}|${input.paymentId}`;

    const expectedSignature =
      crypto
        .createHmac(
          'sha256',
          input.secret,
        )
        .update(body)
        .digest('hex');

    return (
      expectedSignature ===
      input.signature
    );
  }

  // =======================
  // 💸 REFUND PAYMENT
  // =======================

  async refundPayment(input: {
    paymentId: string;

    amount?: number;
  }) {
    const refund =
      await this.razorpay.payments.refund(
        input.paymentId,
        {
          amount: input.amount
            ? Math.round(
                input.amount * 100,
              )
            : undefined,
        },
      );

    return refund;
  }
}
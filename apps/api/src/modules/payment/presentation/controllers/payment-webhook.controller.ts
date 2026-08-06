// src/modules/payment/presentation/controllers/payment-webhook.controller.ts

import { Body, Controller, Headers, Post } from '@nestjs/common';

import { HandleWebhookUseCase } from '../../application/use-cases/handle-webhook.use-case';

@Controller('payment-webhooks')
export class PaymentWebhookController {
  constructor(private readonly handleWebhookUseCase: HandleWebhookUseCase) {}

  // =======================
  // 🪝 RAZORPAY WEBHOOK
  // =======================

  @Post('razorpay')
  async razorpayWebhook(
    @Body()
    payload: Record<string, any>,

    @Headers('x-razorpay-signature')
    signature?: string,
  ) {
    const data = await this.handleWebhookUseCase.execute({
      provider: 'RAZORPAY',

      payload: {
        ...payload,

        signature,
      },
    });

    return {
      message: 'Razorpay webhook handled successfully',

      data,
    };
  }

  // =======================
  // 🪝 STRIPE WEBHOOK
  // =======================

  @Post('stripe')
  async stripeWebhook(
    @Body()
    payload: Record<string, any>,

    @Headers('stripe-signature')
    signature?: string,
  ) {
    const data = await this.handleWebhookUseCase.execute({
      provider: 'STRIPE',

      payload: {
        ...payload,

        signature,
      },
    });

    return {
      message: 'Stripe webhook handled successfully',

      data,
    };
  }
}

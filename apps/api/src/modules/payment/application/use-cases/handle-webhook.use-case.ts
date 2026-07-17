// src/modules/payment/application/use-cases/handle-webhook.use-case.ts

import { Injectable } from '@nestjs/common';

import { PaymentWebhookService } from '../services/payment-webhook.service';

import { HandlePaymentSuccessUseCase } from './handle-payment-success.use-case';

import { HandlePaymentFailureUseCase } from './handle-payment-failure.use-case';

@Injectable()
export class HandleWebhookUseCase {
  constructor(
    private readonly paymentWebhookService: PaymentWebhookService,

    private readonly handlePaymentSuccessUseCase: HandlePaymentSuccessUseCase,

    private readonly handlePaymentFailureUseCase: HandlePaymentFailureUseCase,
  ) {}

  async execute(input: {
    provider: string;

    payload: Record<string, any>;
  }) {
    // =======================
    // 📄 WEBHOOK PAYLOAD
    // =======================

    const payload = input.payload;

    // =======================
    // 🔍 EXTRACT EVENT
    // =======================

    const event = this.paymentWebhookService.extractEvent(payload);

    // =======================
    // 🔍 EXTRACT IDS
    // =======================

    const providerPaymentId = this.paymentWebhookService.extractPaymentId(payload);

    const providerOrderId = this.paymentWebhookService.extractOrderId(payload);

    // =======================
    // ✅ SUCCESS EVENT
    // =======================

    if (this.paymentWebhookService.isSuccessEvent(event)) {
      return this.handlePaymentSuccessUseCase.execute({
        providerPaymentId,

        webhookEvent: event,

        webhookPayload: payload,
      });
    }

    // =======================
    // ❌ FAILURE EVENT
    // =======================

    if (this.paymentWebhookService.isFailureEvent(event)) {
      return this.handlePaymentFailureUseCase.execute({
        providerPaymentId,

        failureCode: payload.error?.code,

        failureReason: payload.error?.description,

        webhookEvent: event,

        webhookPayload: payload,
      });
    }

    // =======================
    // ⚠️ UNKNOWN EVENT
    // =======================

    return {
      success: true,

      message: 'Webhook received but ignored',

      data: {
        provider: input.provider,

        event,

        providerPaymentId,

        providerOrderId,
      },
    };
  }
}

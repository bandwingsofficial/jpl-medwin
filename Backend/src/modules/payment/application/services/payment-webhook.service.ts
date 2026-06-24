// src/modules/payment/application/services/payment-webhook.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentWebhookService {
  // =======================
  // 🔍 EXTRACT EVENT
  // =======================

  extractEvent(payload: Record<string, any>): string {
    return payload.event ?? payload.type ?? 'unknown';
  }

  // =======================
  // 💳 EXTRACT PAYMENT ID
  // =======================

  extractPaymentId(payload: Record<string, any>): string | undefined {
    return payload.payload?.payment?.entity?.id ?? payload.data?.object?.id;
  }

  // =======================
  // 📦 EXTRACT ORDER ID
  // =======================

  extractOrderId(payload: Record<string, any>): string | undefined {
    return payload.payload?.payment?.entity?.order_id ?? payload.data?.object?.metadata?.orderId;
  }

  // =======================
  // ✅ SUCCESS EVENT
  // =======================

  isSuccessEvent(event: string): boolean {
    return ['payment.captured', 'payment.authorized', 'payment_intent.succeeded'].includes(event);
  }

  // =======================
  // ❌ FAILURE EVENT
  // =======================

  isFailureEvent(event: string): boolean {
    return ['payment.failed', 'payment_intent.payment_failed'].includes(event);
  }

  // =======================
  // 💸 REFUND EVENT
  // =======================

  isRefundEvent(event: string): boolean {
    return ['refund.processed', 'charge.refunded'].includes(event);
  }
}

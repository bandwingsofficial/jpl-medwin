// src/modules/payment/domain/entities/payment.entity.ts

import { randomUUID } from 'crypto';

import { PaymentProvider } from '../enums/payment-provider.enum';

import { PaymentStatus } from '../enums/payment-status.enum';

import { PaymentMethod } from '../enums/payment-method.enum';

import { InvalidPaymentOperationException } from '../exceptions/invalid-payment-operation.exception';

export class Payment {
  id: string;

  // =======================
  // 🔗 RELATIONS
  // =======================

  orderId!: string;

  // =======================
  // 💳 PROVIDER
  // =======================

  provider!: PaymentProvider;

  method?: PaymentMethod;

  // =======================
  // 📦 STATUS
  // =======================

  status: PaymentStatus;

  // =======================
  // 💰 MONEY
  // =======================

  amount!: number;

  currency: string;

  refundedAmount: number;

  // =======================
  // 🆔 PROVIDER IDS
  // =======================

  providerOrderId?: string;

  providerPaymentId?: string;

  providerRefundId?: string;

  providerSignature?: string;

  // =======================
  // 📄 WEBHOOK
  // =======================

  webhookEvent?: string;

  webhookPayload?: Record<string, any>;

  // =======================
  // ❌ FAILURE
  // =======================

  failureCode?: string;

  failureReason?: string;

  // =======================
  // 🔁 RETRIES
  // =======================

  retryCount: number;

  // =======================
  // 📦 METADATA
  // =======================

  metadata?: Record<string, any>;

  // =======================
  // 🕒 TIMESTAMPS
  // =======================

  authorizedAt?: Date;

  capturedAt?: Date;

  failedAt?: Date;

  refundedAt?: Date;

  createdAt: Date;

  updatedAt: Date;

  deletedAt?: Date;

  constructor(props?: Partial<Payment>) {
    Object.assign(this, props);

    this.id ??= randomUUID();

    this.status ??= PaymentStatus.PENDING;

    this.currency ??= 'INR';

    this.refundedAmount ??= 0;

    this.retryCount ??= 0;

    this.createdAt ??= new Date();

    this.updatedAt ??= new Date();
  }

  // =======================
  // 🏗 CREATE
  // =======================

  markCreated(input?: { providerOrderId?: string }) {
    this.status = PaymentStatus.CREATED;

    this.providerOrderId = input?.providerOrderId;

    this.touch();
  }

  // =======================
  // 🔐 AUTHORIZE
  // =======================

  authorize(input?: {
    paymentId?: string;

    signature?: string;
  }) {
    this.status = PaymentStatus.AUTHORIZED;

    this.providerPaymentId = input?.paymentId;

    this.providerSignature = input?.signature;

    this.authorizedAt = new Date();

    this.touch();
  }

  // =======================
  // 💰 CAPTURE
  // =======================

  capture(input?: { paymentId?: string }) {
    this.status = PaymentStatus.SUCCESS;

    this.providerPaymentId = input?.paymentId;

    this.capturedAt = new Date();

    this.touch();
  }

  // =======================
  // ❌ FAIL
  // =======================

  fail(input?: {
    code?: string;

    reason?: string;
  }) {
    this.status = PaymentStatus.FAILED;

    this.failureCode = input?.code;

    this.failureReason = input?.reason;

    this.failedAt = new Date();

    this.retryCount += 1;

    this.touch();
  }

  // =======================
  // 🚫 CANCEL
  // =======================

  cancel() {
    this.status = PaymentStatus.CANCELLED;

    this.touch();
  }

  // =======================
  // 💸 REFUND
  // =======================

  refund(input: {
    amount: number;

    refundId?: string;
  }) {
    if (this.status !== PaymentStatus.SUCCESS) {
      throw new InvalidPaymentOperationException({
        paymentId: this.id,

        operation: 'refund',

        reason: 'Only successful payments can be refunded',
      });
    }

    this.refundedAmount += input.amount;

    this.providerRefundId = input.refundId;

    // =======================
    // FULL REFUND
    // =======================

    if (this.refundedAmount >= this.amount) {
      this.status = PaymentStatus.REFUNDED;
    }

    // =======================
    // PARTIAL REFUND
    // =======================
    else {
      this.status = PaymentStatus.PARTIALLY_REFUNDED;
    }

    this.refundedAt = new Date();

    this.touch();
  }

  // =======================
  // 📄 STORE WEBHOOK
  // =======================

  storeWebhook(input: {
    event?: string;

    payload?: Record<string, any>;
  }) {
    this.webhookEvent = input.event;

    this.webhookPayload = input.payload;

    this.touch();
  }

  // =======================
  // ♻️ DELETE
  // =======================

  softDelete() {
    this.deletedAt = new Date();

    this.touch();
  }

  // =======================
  // 🕒 TOUCH
  // =======================

  touch() {
    this.updatedAt = new Date();
  }

  // =======================
  // 🔍 HELPERS
  // =======================

  isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  isSuccessful(): boolean {
    return this.status === PaymentStatus.SUCCESS || this.status === PaymentStatus.CAPTURED;
  }

  isFailed(): boolean {
    return this.status === PaymentStatus.FAILED;
  }

  isRefunded(): boolean {
    return (
      this.status === PaymentStatus.REFUNDED || this.status === PaymentStatus.PARTIALLY_REFUNDED
    );
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }
}

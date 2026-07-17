// src/modules/payment/domain/enums/payment-status.enum.ts

export enum PaymentStatus {
  PENDING = 'PENDING',

  CREATED = 'CREATED',

  AUTHORIZED = 'AUTHORIZED',

  CAPTURED = 'CAPTURED',

  SUCCESS = 'SUCCESS',

  FAILED = 'FAILED',

  CANCELLED = 'CANCELLED',

  REFUNDED = 'REFUNDED',

  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

// =======================
// 🔥 HELPERS
// =======================

export const PAYMENT_STATUS_VALUES = Object.values(PaymentStatus);

export type PaymentStatusType = (typeof PAYMENT_STATUS_VALUES)[number];

export const isPaymentStatus = (value: string): value is PaymentStatus => {
  return PAYMENT_STATUS_VALUES.includes(value as PaymentStatus);
};

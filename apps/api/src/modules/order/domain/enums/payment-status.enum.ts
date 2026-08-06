export enum PaymentStatus {
  // =======================
  // 🕒 INITIAL
  // =======================

  PENDING = 'PENDING',

  CREATED = 'CREATED',

  // =======================
  // 🔐 AUTH FLOW
  // =======================

  AUTHORIZED = 'AUTHORIZED',

  CAPTURED = 'CAPTURED',

  // =======================
  // ✅ FINAL SUCCESS
  // =======================

  SUCCESS = 'SUCCESS',

  // =======================
  // ❌ FAILURE
  // =======================

  FAILED = 'FAILED',

  CANCELLED = 'CANCELLED',

  // =======================
  // 💸 REFUNDS
  // =======================

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

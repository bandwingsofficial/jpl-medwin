// src/modules/checkout-session/domain/enums/checkout-session-status.enum.ts

export enum CheckoutSessionStatus {
  ACTIVE = 'ACTIVE',

  COMPLETED = 'COMPLETED',

  FAILED = 'FAILED',

  EXPIRED = 'EXPIRED',
}

// 🔥 Useful helpers

export const CHECKOUT_SESSION_STATUS_VALUES = Object.values(CheckoutSessionStatus);

export type CheckoutSessionStatusType = (typeof CHECKOUT_SESSION_STATUS_VALUES)[number];

// Optional: type guard

export const isCheckoutSessionStatus = (value: string): value is CheckoutSessionStatus => {
  return CHECKOUT_SESSION_STATUS_VALUES.includes(value as CheckoutSessionStatus);
};

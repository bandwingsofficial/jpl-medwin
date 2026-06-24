// src/modules/payment/domain/enums/payment-provider.enum.ts

export enum PaymentProvider {
  RAZORPAY = 'RAZORPAY',

  STRIPE = 'STRIPE',

  COD = 'COD',

  MANUAL = 'MANUAL',
}

// =======================
// 🔥 HELPERS
// =======================

export const PAYMENT_PROVIDER_VALUES = Object.values(PaymentProvider);

export type PaymentProviderType = (typeof PAYMENT_PROVIDER_VALUES)[number];

export const isPaymentProvider = (value: string): value is PaymentProvider => {
  return PAYMENT_PROVIDER_VALUES.includes(value as PaymentProvider);
};

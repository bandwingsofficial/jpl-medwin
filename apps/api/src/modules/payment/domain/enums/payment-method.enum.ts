// src/modules/payment/domain/enums/payment-method.enum.ts

export enum PaymentMethod {
  CARD = 'CARD',

  UPI = 'UPI',

  NETBANKING = 'NETBANKING',

  WALLET = 'WALLET',

  EMI = 'EMI',

  COD = 'COD',
}

// =======================
// 🔥 HELPERS
// =======================

export const PAYMENT_METHOD_VALUES = Object.values(PaymentMethod);

export type PaymentMethodType = (typeof PAYMENT_METHOD_VALUES)[number];

export const isPaymentMethod = (value: string): value is PaymentMethod => {
  return PAYMENT_METHOD_VALUES.includes(value as PaymentMethod);
};

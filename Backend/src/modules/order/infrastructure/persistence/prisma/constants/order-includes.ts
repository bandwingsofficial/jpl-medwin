// src/modules/order/infrastructure/persistence/prisma/constants/order-includes.ts

export const ORDER_ADDRESS_INCLUDE = {
  shippingAddress: true,
  billingAddress: true,
} as const;

export const ORDER_DEFAULT_INCLUDE = {
  ...ORDER_ADDRESS_INCLUDE,
  returns: true,
} as const;

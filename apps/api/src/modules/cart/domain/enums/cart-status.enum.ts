// src/modules/cart/domain/enums/cart-status.enum.ts

export enum CartStatus {
  ACTIVE = 'ACTIVE',

  LOCKED = 'LOCKED',

  CONVERTED = 'CONVERTED',

  ABANDONED = 'ABANDONED',

  EXPIRED = 'EXPIRED',

  MERGED = 'MERGED',
}

// 🔥 Useful helpers

export const CART_STATUS_VALUES = Object.values(CartStatus);

export type CartStatusType = (typeof CART_STATUS_VALUES)[number];

// Optional: type guard

export const isCartStatus = (value: string): value is CartStatus => {
  return CART_STATUS_VALUES.includes(value as CartStatus);
};

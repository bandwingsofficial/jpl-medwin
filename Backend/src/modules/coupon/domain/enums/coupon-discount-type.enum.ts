// src/modules/coupon/domain/enums/coupon-discount-type.enum.ts

export enum CouponDiscountType {
  PERCENTAGE = 'PERCENTAGE',

  FIXED = 'FIXED',
}

// 🔥 Useful helpers

export const COUPON_DISCOUNT_TYPE_VALUES = Object.values(CouponDiscountType);

export type CouponDiscountTypeType = (typeof COUPON_DISCOUNT_TYPE_VALUES)[number];

// Optional: type guard

export const isCouponDiscountType = (value: string): value is CouponDiscountType => {
  return COUPON_DISCOUNT_TYPE_VALUES.includes(value as CouponDiscountType);
};

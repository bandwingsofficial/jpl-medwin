// src/modules/coupon/domain/enums/coupon-status.enum.ts

export enum CouponStatus {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',

  EXPIRED = 'EXPIRED',
}

// 🔥 Useful helpers

export const COUPON_STATUS_VALUES = Object.values(CouponStatus);

export type CouponStatusType = (typeof COUPON_STATUS_VALUES)[number];

// Optional: type guard

export const isCouponStatus = (value: string): value is CouponStatus => {
  return COUPON_STATUS_VALUES.includes(value as CouponStatus);
};

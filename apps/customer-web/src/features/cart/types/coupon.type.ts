export type CouponStatus =
  | "ACTIVE"
  | "INACTIVE";

export type CouponDiscountType =
  | "PERCENTAGE"
  | "FIXED";

export interface AppliedCoupon {
  couponId: string;

  couponCode: string;

  discountType: CouponDiscountType;

  discountValue: number;

  discount: number;

  minimumOrderAmount: number;

  maximumDiscountAmount: number;

  status: CouponStatus;

  expiresAt: string;
}

export interface ApplyCouponPayload {
  couponCode: string;
}

export interface ApplyCouponResponse {
  success: boolean;

  message: string;

  data: AppliedCoupon;
}

export interface RemoveCouponResponse {
  success: boolean;

  message: string;
}
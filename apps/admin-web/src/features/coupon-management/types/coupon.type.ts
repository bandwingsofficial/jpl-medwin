export type CouponStatus = "ACTIVE" | "INACTIVE";

export type DiscountType = "PERCENTAGE" | "FIXED";

export interface Coupon {
  id: string;
  code: string;

  discountType: DiscountType;
  discountValue: number;

  minimumOrderAmount: number;
  maximumDiscountAmount: number;

  usageLimit: number;
  usedCount: number;

  perUserLimit: number;

  status: CouponStatus;

  isPublic: boolean;

  startsAt: string;
  expiresAt: string;

  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateCouponPayload {
  code: string;

  discountType: DiscountType;
  discountValue: number;

  minimumOrderAmount: number;
  maximumDiscountAmount: number;

  usageLimit: number;
  perUserLimit: number;

  isPublic: boolean;

  startsAt: string;
  expiresAt: string;
}

export interface UpdateCouponPayload
  extends Partial<CreateCouponPayload> {
  id: string;
  status?: CouponStatus;
}

export interface CouponListResponse {
  success: boolean;
  message: string;
  data: Coupon[];
}

export interface CouponSingleResponse {
  success: boolean;
  message: string;
  data: Coupon;
}

export interface ValidateCouponPayload {
  couponCode: string;
  subtotal: number;
}

export interface ValidateCouponResponse {
  couponId: string;
  couponCode: string;

  discountType: DiscountType;
  discountValue: number;

  discount: number;

  minimumOrderAmount: number;
  maximumDiscountAmount: number;

  status: CouponStatus;

  expiresAt: string;
}
// src/modules/coupon/domain/repositories/coupon.repository.ts

import { Coupon } from '../entities/coupon.entity';

import { CouponStatus } from '../enums/coupon-status.enum';

export interface CouponRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<Coupon | null>;

  findByIdIncludingDeleted(id: string): Promise<Coupon | null>;

  findByCode(code: string): Promise<Coupon | null>;

  findByCodeIncludingDeleted(code: string): Promise<Coupon | null>;

  findAll(): Promise<Coupon[]>;

  findAllIncludingDeleted(): Promise<Coupon[]>;

  findByStatus(status: CouponStatus): Promise<Coupon[]>;

  findActiveCoupons(): Promise<Coupon[]>;

  findExpiredCoupons(): Promise<Coupon[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsById(id: string): Promise<boolean>;

  existsByCode(code: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(coupon: Coupon): Promise<Coupon>;

  update(coupon: Coupon): Promise<Coupon>;

  // =======================
  // 📊 USAGE
  // =======================

  incrementUsage(couponId: string): Promise<void>;

  countUserCouponUsage(params: {
    couponId: string;

    userId: string;
  }): Promise<number>;

  hasUserUsedCouponForOrder(params: {
    couponId: string;

    userId: string;

    orderId: string;
  }): Promise<boolean>;

  redeemCoupon(params: {
    couponId: string;

    userId: string;

    orderId: string;

    discountAmount: number;
  }): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(id: string): Promise<void>;

  restore(id: string): Promise<void>;
}

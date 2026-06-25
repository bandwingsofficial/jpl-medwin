// src/modules/coupon/domain/entities/coupon.entity.ts

import { CouponDiscountType } from '../enums/coupon-discount-type.enum';

import { CouponStatus } from '../enums/coupon-status.enum';

import { CouponExpiredException } from '../exceptions/coupon-expired.exception';

import { CouponNotActiveException } from '../exceptions/coupon-not-active.exception';

import { CouponUsageLimitReachedException } from '../exceptions/coupon-usage-limit-reached.exception';

import { InvalidCouponException } from '../exceptions/invalid-coupon.exception';

export class Coupon {
  constructor(
    public readonly id: string,

    // =======================
    // 🎟 BASIC
    // =======================

    public code: string,

    public discountType: CouponDiscountType,

    public discountValue: number,

    // =======================
    // 💰 LIMITS
    // =======================

    public minimumOrderAmount?: number,

    public maximumDiscountAmount?: number,

    public usageLimit?: number,

    public usedCount: number = 0,

    public perUserLimit?: number,

    // =======================
    // 🚦 STATUS
    // =======================

    public status: CouponStatus = CouponStatus.ACTIVE,

    public isPublic: boolean = true,

    // =======================
    // ⏰ VALIDITY
    // =======================

    public startsAt?: Date,

    public expiresAt?: Date,

    // =======================
    // 🕒 TIMESTAMPS
    // =======================

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return this.status === CouponStatus.ACTIVE && !this.deletedAt;
  }

  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }

    return new Date() > this.expiresAt;
  }

  isPercentage(): boolean {
    return this.discountType === CouponDiscountType.PERCENTAGE;
  }

  isFixed(): boolean {
    return this.discountType === CouponDiscountType.FIXED;
  }

  hasUsageLimit(): boolean {
    return this.usageLimit !== undefined;
  }

  hasMinimumOrderAmount(): boolean {
    return this.minimumOrderAmount !== undefined;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  activate() {
    this.status = CouponStatus.ACTIVE;

    this.touch();
  }

  deactivate() {
    this.status = CouponStatus.INACTIVE;

    this.touch();
  }

  incrementUsage() {
    this.ensureUsable();

    this.usedCount += 1;

    this.touch();
  }

  softDelete() {
    this.deletedAt = new Date();

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.touch();
  }

  updateDetails(params: {
    code?: string;

    discountType?: CouponDiscountType;

    discountValue?: number;

    minimumOrderAmount?: number;

    maximumDiscountAmount?: number;

    usageLimit?: number;

    perUserLimit?: number;

    status?: CouponStatus;

    isPublic?: boolean;

    startsAt?: Date;

    expiresAt?: Date;
  }) {
    // =======================
    // 🎟 BASIC
    // =======================

    if (params.code !== undefined) {
      this.code = params.code;
    }

    if (params.discountType !== undefined) {
      this.discountType = params.discountType;
    }

    if (params.discountValue !== undefined) {
      this.discountValue = params.discountValue;
    }

    // =======================
    // 💰 LIMITS
    // =======================

    if (params.minimumOrderAmount !== undefined) {
      this.minimumOrderAmount = params.minimumOrderAmount;
    }

    if (params.maximumDiscountAmount !== undefined) {
      this.maximumDiscountAmount = params.maximumDiscountAmount;
    }

    if (params.usageLimit !== undefined) {
      this.usageLimit = params.usageLimit;
    }

    if (params.perUserLimit !== undefined) {
      this.perUserLimit = params.perUserLimit;
    }

    // =======================
    // 🚦 STATUS
    // =======================

    if (params.status !== undefined) {
      this.status = params.status;
    }

    if (params.isPublic !== undefined) {
      this.isPublic = params.isPublic;
    }

    // =======================
    // ⏰ VALIDITY
    // =======================

    if (params.startsAt !== undefined) {
      this.startsAt = params.startsAt;
    }

    if (params.expiresAt !== undefined) {
      this.expiresAt = params.expiresAt;
    }

    // =======================
    // 🔥 VALIDATE
    // =======================

    this.validate();

    this.touch();
  }

  calculateDiscount(subtotal: number): number {
    this.ensureUsable();

    // =======================
    // ❌ INVALID SUBTOTAL
    // =======================

    if (subtotal <= 0) {
      throw new InvalidCouponException({
        message: 'Subtotal must be greater than 0',

        couponCode: this.code,
      });
    }

    // =======================
    // 💰 MINIMUM ORDER
    // =======================

    if (this.minimumOrderAmount && subtotal < this.minimumOrderAmount) {
      throw new InvalidCouponException({
        message: 'Minimum order amount not reached',

        couponCode: this.code,
      });
    }

    let discount = 0;

    // =======================
    // 📊 PERCENTAGE
    // =======================

    if (this.isPercentage()) {
      discount = (subtotal * this.discountValue) / 100;

      if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
        discount = this.maximumDiscountAmount;
      }
    }

    // =======================
    // 💵 FIXED
    // =======================

    if (this.isFixed()) {
      discount = Math.min(this.discountValue, subtotal);
    }

    // =======================
    // ❌ NEGATIVE
    // =======================

    if (discount < 0) {
      throw new InvalidCouponException({
        message: 'Invalid discount amount',

        couponCode: this.code,
      });
    }

    return Number(discount.toFixed(2));
  }

  // =======================
  // 🛡️ GUARDS
  // =======================

  ensureUsable() {
    // =======================
    // ❌ NOT ACTIVE
    // =======================

    if (!this.isActive()) {
      throw new CouponNotActiveException({
        couponId: this.id,

        couponCode: this.code,
      });
    }

    // =======================
    // ⏰ NOT STARTED
    // =======================

    if (this.startsAt && new Date() < this.startsAt) {
      throw new InvalidCouponException({
        message: 'Coupon is not active yet',

        couponCode: this.code,
      });
    }

    // =======================
    // ⏰ EXPIRED
    // =======================

    if (this.isExpired()) {
      throw new CouponExpiredException({
        couponId: this.id,

        couponCode: this.code,

        expiresAt: this.expiresAt,
      });
    }

    // =======================
    // 📊 USAGE LIMIT
    // =======================

    if (this.usageLimit !== undefined && this.usedCount >= this.usageLimit) {
      throw new CouponUsageLimitReachedException({
        couponId: this.id,

        couponCode: this.code,

        usageLimit: this.usageLimit,
      });
    }
  }

  validate() {
    // =======================
    // 🎟 CODE
    // =======================

    if (!this.code?.trim()) {
      throw new InvalidCouponException({
        couponCode: this.code,

        message: 'Coupon code is required',
      });
    }

    // =======================
    // 💰 DISCOUNT
    // =======================

    if (this.discountValue <= 0) {
      throw new InvalidCouponException({
        couponCode: this.code,

        message: 'Discount value must be greater than 0',
      });
    }

    // =======================
    // 📊 PERCENTAGE
    // =======================

    if (this.isPercentage() && this.discountValue > 100) {
      throw new InvalidCouponException({
        couponCode: this.code,

        message: 'Percentage discount cannot exceed 100',
      });
    }

    // =======================
    // 📊 USAGE LIMIT
    // =======================

    if (this.usageLimit !== undefined && this.usedCount > this.usageLimit) {
      throw new InvalidCouponException({
        couponCode: this.code,

        message: 'Usage limit cannot be less than used count',
      });
    }

    // =======================
    // ⏰ DATE VALIDATION
    // =======================

    if (this.startsAt && this.expiresAt && this.startsAt > this.expiresAt) {
      throw new InvalidCouponException({
        couponCode: this.code,

        message: 'Start date cannot be after expiry date',
      });
    }
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}

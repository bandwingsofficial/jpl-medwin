// src/modules/checkout-session/domain/entities/checkout-session.entity.ts

import { CheckoutSessionStatus } from '../enums/checkout-session-status.enum';

import { CheckoutSessionExpiredException } from '../exceptions/checkout-session-expired.exception';

import { CheckoutSessionCompletedException } from '../exceptions/checkout-session-completed.exception';

export class CheckoutSession {
  constructor(
    public readonly id: string,

    // =======================
    // 🛒 CART
    // =======================

    public cartId: string,

    // =======================
    // 👤 OWNERSHIP
    // =======================

    public userId?: string,

    public guestId?: string,

    // =======================
    // 📦 STATUS
    // =======================

    public status: CheckoutSessionStatus = CheckoutSessionStatus.ACTIVE,

    // =======================
    // 🎟 COUPON
    // =======================

    public couponCode?: string,

    // =======================
    // 💰 TOTALS SNAPSHOT
    // =======================

    public subtotal: number = 0,

    public couponDiscount: number = 0,

    // =======================
    // 🪙 REWARDS
    // =======================

    public rewardCoinsUsed: number = 0,

    public rewardDiscount: number = 0,

    // =======================
    // 🚚 CHARGES
    // =======================

    public shippingCharge: number = 0,

    public tax: number = 0,

    // =======================
    // 💵 FINAL TOTALS
    // =======================

    public grandTotal: number = 0,

    public totalSavings: number = 0,

    // =======================
    // ⏳ EXPIRY
    // =======================

    public expiresAt: Date = new Date(),

    // =======================
    // 📦 METADATA
    // =======================

    public metadata: Record<string, unknown> = {},

    // =======================
    // 📦 STATE DATES
    // =======================

    public completedAt?: Date,

    public failedAt?: Date,

    // =======================
    // 🕒 TIMESTAMPS
    // =======================

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),

    // =======================
    // ♻️ DELETE
    // =======================

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return (
      this.status === CheckoutSessionStatus.ACTIVE &&
      !this.deletedAt
    );
  }

  isCompleted(): boolean {
    return this.status === CheckoutSessionStatus.COMPLETED;
  }

  isFailed(): boolean {
    return this.status === CheckoutSessionStatus.FAILED;
  }

  isExpired(): boolean {
    if (!this.expiresAt) {
      return false;
    }

    return this.expiresAt.getTime() < Date.now();
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  complete() {
    this.ensureUsable();

    this.status = CheckoutSessionStatus.COMPLETED;

    this.completedAt = new Date();

    this.touch();
  }

  fail() {
    if (this.isCompleted()) {
      throw new CheckoutSessionCompletedException({
        checkoutSessionId: this.id,
      });
    }

    this.status = CheckoutSessionStatus.FAILED;

    this.failedAt = new Date();

    this.touch();
  }

  expire() {
    if (this.isCompleted()) {
      throw new CheckoutSessionCompletedException({
        checkoutSessionId: this.id,
      });
    }

    this.status = CheckoutSessionStatus.EXPIRED;

    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) {
      return;
    }

    this.deletedAt = new Date();

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.status = CheckoutSessionStatus.ACTIVE;

    this.touch();
  }

  // =======================
  // 🪙 APPLY REWARDS
  // =======================

  applyRewards(params: {
    coinsUsed: number;

    rewardDiscount: number;
  }) {
    this.rewardCoinsUsed = params.coinsUsed;

    this.rewardDiscount = params.rewardDiscount;

    this.recalculateTotals();

    this.touch();
  }

  // =======================
  // ❌ REMOVE REWARDS
  // =======================

  removeRewards() {
    this.rewardCoinsUsed = 0;

    this.rewardDiscount = 0;

    this.recalculateTotals();

    this.touch();
  }

  // =======================
  // 🎟 APPLY COUPON
  // =======================

  applyCoupon(params: {
    couponCode: string;

    couponDiscount: number;
  }) {
    this.couponCode = params.couponCode;

    this.couponDiscount = params.couponDiscount;

    this.recalculateTotals();

    this.touch();
  }

  // =======================
  // ❌ REMOVE COUPON
  // =======================

  removeCoupon() {
    this.couponCode = undefined;

    this.couponDiscount = 0;

    this.recalculateTotals();

    this.touch();
  }

  // =======================
  // 💰 RECALCULATE TOTALS
  // =======================

  recalculateTotals() {
    this.totalSavings =
      this.couponDiscount + this.rewardDiscount;

    this.grandTotal = Math.max(
      this.subtotal -
        this.couponDiscount -
        this.rewardDiscount +
        this.shippingCharge +
        this.tax,
      0,
    );
  }

  // =======================
  // 🛡️ GUARDS
  // =======================

  ensureUsable() {
    if (this.isExpired()) {
      throw new CheckoutSessionExpiredException({
        checkoutSessionId: this.id,
      });
    }

    if (this.isCompleted()) {
      throw new CheckoutSessionCompletedException({
        checkoutSessionId: this.id,
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
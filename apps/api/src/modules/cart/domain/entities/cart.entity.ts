// src/modules/cart/domain/entities/cart.entity.ts

import { CartStatus } from '../enums/cart-status.enum';

import { CartLockedException } from '../exceptions/cart-locked.exception';

import { CartExpiredException } from '../exceptions/cart-expired.exception';

import { CartAlreadyConvertedException } from '../exceptions/cart-already-converted.exception';
import { InvalidCartOperationException } from '../exceptions/invalid-cart-operation.exception';

import { CartAlreadyMergedException } from '../exceptions/cart-already-merged.exception';

export class Cart {
  constructor(
    public readonly id: string,

    // =======================
    // 👤 OWNERSHIP
    // =======================

    public userId?: string,

    public guestId?: string,

    // =======================
    // 📦 STATUS
    // =======================

    public status: CartStatus = CartStatus.ACTIVE,

    // =======================
    // 🎟 OPTIONAL
    // =======================

    public couponId?: string,

    public couponCode?: string,

    public couponDiscount?: number,
    // =======================
    // 🔒 LOCK
    // =======================

    public lockedAt?: Date,

    // =======================
    // 🔄 MERGE
    // =======================

    public mergedIntoCartId?: string,

    // =======================
    // ⏳ EXPIRY
    // =======================

    public expiresAt?: Date,

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
    return this.status === CartStatus.ACTIVE && !this.deletedAt;
  }

  isLocked(): boolean {
    return this.status === CartStatus.LOCKED;
  }

  isConverted(): boolean {
    return this.status === CartStatus.CONVERTED;
  }

  isMerged(): boolean {
    return this.status === CartStatus.MERGED;
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

  lock() {
    this.ensureUsable();

    this.status = CartStatus.LOCKED;

    this.lockedAt = new Date();

    this.touch();
  }

  unlock() {
    if (this.status !== CartStatus.LOCKED) {
      throw new InvalidCartOperationException({
        cartId: this.id,
        operation: 'unlock',
      });
    }

    this.status = CartStatus.ACTIVE;

    this.lockedAt = undefined;

    this.touch();
  }

  // 🔥 LOCKED → CONVERTED
  // valid ecommerce flow

  convert() {
    // expired
    if (this.isExpired()) {
      throw new CartExpiredException({
        cartId: this.id,
      });
    }

    // already converted
    if (this.isConverted()) {
      throw new CartAlreadyConvertedException({
        cartId: this.id,
      });
    }

    // merged
    if (this.isMerged()) {
      throw new CartAlreadyMergedException({
        cartId: this.id,
      });
    }

    this.status = CartStatus.CONVERTED;

    this.touch();
  }

  mergeInto(cartId: string) {
    if (this.isMerged()) {
      throw new CartAlreadyMergedException({
        cartId: this.id,
      });
    }

    this.status = CartStatus.MERGED;

    this.mergedIntoCartId = cartId;

    this.touch();
  }

  expire() {
    this.status = CartStatus.EXPIRED;

    this.touch();
  }

  abandon() {
    this.status = CartStatus.ABANDONED;

    this.touch();
  }

  applyCoupon(input: {
    couponId: string;

    couponCode: string;

    couponDiscount: number;
  }) {
    this.ensureUsable();

    this.couponId = input.couponId;

    this.couponCode = input.couponCode;

    this.couponDiscount = input.couponDiscount;

    this.touch();
  }

  removeCoupon() {
    this.couponId = undefined;

    this.couponCode = undefined;

    this.couponDiscount = undefined;

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

    this.status = CartStatus.ACTIVE;

    this.touch();
  }

  // =======================
  // 🛡️ GUARDS
  // =======================

  ensureUsable() {
    if (this.isLocked()) {
      throw new CartLockedException({
        cartId: this.id,
      });
    }

    if (this.isExpired()) {
      throw new CartExpiredException({
        cartId: this.id,
      });
    }

    if (this.isConverted()) {
      throw new CartAlreadyConvertedException({
        cartId: this.id,
      });
    }

    if (this.isMerged()) {
      throw new CartAlreadyMergedException({
        cartId: this.id,
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

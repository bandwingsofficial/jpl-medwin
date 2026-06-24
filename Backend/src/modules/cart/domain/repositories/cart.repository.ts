// src/modules/cart/domain/repositories/cart.repository.ts

import { Cart } from '../entities/cart.entity';

import { CartStatus } from '../enums/cart-status.enum';

export interface CartRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<Cart | null>;

  findActiveByUserId(userId: string): Promise<Cart | null>;

  findActiveByGuestId(guestId: string): Promise<Cart | null>;

  findByUserId(userId: string): Promise<Cart[]>;

  findByGuestId(guestId: string): Promise<Cart[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsActiveCartByUserId(userId: string): Promise<boolean>;

  existsActiveCartByGuestId(guestId: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(cart: Cart): Promise<Cart>;

  update(cart: Cart): Promise<Cart>;

  // =======================
  // 🔄 STATUS
  // =======================

  updateStatus(params: {
    cartId: string;

    status: CartStatus;
  }): Promise<void>;

  lock(cartId: string): Promise<void>;

  unlock(cartId: string): Promise<void>;

  convert(cartId: string): Promise<void>;

  expire(cartId: string): Promise<void>;

  abandon(cartId: string): Promise<void>;

  merge(params: {
    sourceCartId: string;

    targetCartId: string;
  }): Promise<void>;

  // =======================
  // 🎟 COUPON
  // =======================

  applyCoupon(params: {
    cartId: string;

    couponId: string;

    couponCode: string;

    couponDiscount: number;
  }): Promise<void>;

  removeCoupon(cartId: string): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(cartId: string): Promise<void>;

  restore(cartId: string): Promise<void>;
}

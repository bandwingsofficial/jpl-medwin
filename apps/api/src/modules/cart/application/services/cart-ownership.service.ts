// src/modules/cart/application/services/cart-ownership.service.ts

import { Injectable } from '@nestjs/common';

import { Cart } from '../../domain/entities/cart.entity';

import { CartOwnershipException } from '../../domain/exceptions/cart-ownership.exception';

@Injectable()
export class CartOwnershipService {
  // =======================
  // 👤 USER OWNERSHIP
  // =======================

  ensureUserOwnership(params: {
    cart: Cart;

    userId: string;
  }) {
    // no cart owner
    if (!params.cart.userId) {
      throw new CartOwnershipException({
        cartId: params.cart.id,

        userId: params.userId,
      });
    }

    // wrong owner
    if (params.cart.userId !== params.userId) {
      throw new CartOwnershipException({
        cartId: params.cart.id,

        userId: params.userId,
      });
    }
  }

  // =======================
  // 👥 GUEST OWNERSHIP
  // =======================

  ensureGuestOwnership(params: {
    cart: Cart;

    guestId: string;
  }) {
    // no guest owner
    if (!params.cart.guestId) {
      throw new CartOwnershipException({
        cartId: params.cart.id,
      });
    }

    // wrong guest
    if (params.cart.guestId !== params.guestId) {
      throw new CartOwnershipException({
        cartId: params.cart.id,
      });
    }
  }

  // =======================
  // 🔐 GENERIC ACCESS CHECK
  // =======================

  ensureOwnership(params: {
    cart: Cart;

    userId?: string;

    guestId?: string;
  }) {
    // =======================
    // 👤 USER
    // =======================

    if (params.userId) {
      return this.ensureUserOwnership({
        cart: params.cart,

        userId: params.userId,
      });
    }

    // =======================
    // 👥 GUEST
    // =======================

    if (params.guestId) {
      return this.ensureGuestOwnership({
        cart: params.cart,

        guestId: params.guestId,
      });
    }

    // =======================
    // ❌ NO OWNER
    // =======================

    throw new CartOwnershipException({
      cartId: params.cart.id,
    });
  }

  // =======================
  // 🔄 CAN MERGE
  // =======================

  canMerge(params: {
    sourceCart: Cart;

    targetCart: Cart;
  }): boolean {
    // same cart
    if (params.sourceCart.id === params.targetCart.id) {
      return false;
    }

    // inactive carts
    if (params.sourceCart.status !== 'ACTIVE' || params.targetCart.status !== 'ACTIVE') {
      return false;
    }

    return true;
  }
}

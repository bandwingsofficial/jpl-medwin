// src/modules/cart/application/use-cases/unlock-cart.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { Cart } from '../../domain/entities/cart.entity';
import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartNotFoundException } from '../../domain/exceptions/cart-not-found.exception';

@Injectable()
export class UnlockCartUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,
  ) {}

  async execute(input: {
    userId?: string;

    guestId?: string;
  }) {
    // =======================
    // 🛒 FIND CART
    // =======================

    let cart: Cart | null = null;

    if (input.userId) {
      cart = await this.cartRepo.findActiveByUserId(input.userId);
    } else if (input.guestId) {
      cart = await this.cartRepo.findActiveByGuestId(input.guestId);
    }

    // =======================
    // ❌ CART NOT FOUND
    // =======================

    if (!cart) {
      throw new CartNotFoundException({});
    }

    // =======================
    // 🔓 UNLOCK CART
    // =======================

    cart.unlock();

    const updated = await this.cartRepo.update(cart);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      status: updated.status,

      lockedAt: updated.lockedAt,

      expiresAt: updated.expiresAt,

      updatedAt: updated.updatedAt,
    };
  }
}

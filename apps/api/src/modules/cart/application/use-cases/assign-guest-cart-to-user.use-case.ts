// src/modules/cart/application/use-cases/convert-cart.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartNotFoundException } from '../../domain/exceptions/cart-not-found.exception';

@Injectable()
export class ConvertCartUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,
  ) {}

  async execute(input: {
    guestId: string;

    userId: string;
  }) {
    // =======================
    // 👥 FIND GUEST CART
    // =======================

    const guestCart = await this.cartRepo.findActiveByGuestId(input.guestId);

    if (!guestCart) {
      throw new CartNotFoundException({});
    }

    // =======================
    // 🔄 CONVERT CART
    // =======================

    guestCart.userId = input.userId;

    guestCart.guestId = undefined;

    const updated = await this.cartRepo.update(guestCart);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      userId: updated.userId,

      guestId: updated.guestId,

      status: updated.status,

      updatedAt: updated.updatedAt,
    };
  }
}

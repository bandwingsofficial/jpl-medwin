// src/modules/cart/application/use-cases/clear-cart.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Cart } from '../../domain/entities/cart.entity';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartNotFoundException } from '../../domain/exceptions/cart-not-found.exception';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class ClearCartUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,

    private readonly domainService: CartDomainService,

    private readonly summaryService: CartSummaryService,
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
    // 🛡 VALIDATE CART
    // =======================

    this.domainService.ensureCartUsable(cart);

    // =======================
    // 📦 GET ITEMS
    // =======================

    const items = await this.cartItemRepo.findByCartId(cart.id);

    // =======================
    // 🗑 DELETE ITEMS
    // =======================

    await Promise.all(items.map((item) => this.cartItemRepo.delete(item.id)));

    // =======================
    // 💰 EMPTY SUMMARY
    // =======================

    const summary = await this.summaryService.build({
      items: [],
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: cart.id,

      status: cart.status,

      totalItems: 0,

      totalQuantity: 0,

      cartItems: [],

      summary,

      createdAt: cart.createdAt,

      updatedAt: new Date(),
    };
  }
}

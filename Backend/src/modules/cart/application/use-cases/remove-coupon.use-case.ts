// src/modules/cart/application/use-cases/remove-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Cart } from '../../domain/entities/cart.entity';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartNotFoundException } from '../../domain/exceptions/cart-not-found.exception';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class RemoveCouponUseCase {
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
    // 🗑 REMOVE COUPON
    // =======================

    cart.removeCoupon();

    // =======================
    // 💾 SAVE CART
    // =======================

    const updatedCart = await this.cartRepo.update(cart);

    // =======================
    // 📦 ITEMS
    // =======================

    const items = await this.cartItemRepo.findByCartId(updatedCart.id);

    // =======================
    // 💰 SUMMARY
    // =======================

    const summary = this.summaryService.build({
      items,

      couponDiscount: 0,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updatedCart.id,

      status: updatedCart.status,

      couponId: updatedCart.couponId,

      couponCode: updatedCart.couponCode,

      couponDiscount: updatedCart.couponDiscount,

      summary,

      updatedAt: updatedCart.updatedAt,
    };
  }
}

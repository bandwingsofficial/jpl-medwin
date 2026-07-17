// src/modules/cart/application/use-cases/apply-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ValidateCouponUseCase } from '@/modules/coupon/application/use-cases/validate-coupon.use-case';

import { Cart } from '../../domain/entities/cart.entity';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartNotFoundException } from '../../domain/exceptions/cart-not-found.exception';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class ApplyCouponUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,

    private readonly domainService: CartDomainService,

    private readonly summaryService: CartSummaryService,

    private readonly validateCouponUseCase: ValidateCouponUseCase,
  ) {}

  async execute(input: {
    userId?: string;

    guestId?: string;

    couponCode: string;
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
    // 📦 CART ITEMS
    // =======================

    const items = await this.cartItemRepo.findByCartId(cart.id);

    // =======================
    // 💰 SUBTOTAL
    // =======================

    const subtotal = this.summaryService.calculateSubtotal(items);

    // =======================
    // 🎟 VALIDATE COUPON
    // =======================

    const couponResult = await this.validateCouponUseCase.execute({
      couponCode: input.couponCode,

      subtotal,

      userId: input.userId,
    });

    // =======================
    // 🎟 APPLY COUPON
    // =======================

    cart.applyCoupon({
      couponId: couponResult.couponId,

      couponCode: couponResult.couponCode,

      couponDiscount: couponResult.discount,
    });

    // =======================
    // 💾 SAVE CART
    // =======================

    const updatedCart = await this.cartRepo.update(cart);

    // =======================
    // 💰 SUMMARY
    // =======================

    const summary = await this.summaryService.build({
      items,

      couponDiscount: couponResult.discount,
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
// src/modules/checkout-session/application/use-cases/complete-checkout-session.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CheckoutSessionRepository } from '../../domain/repositories/checkout-session.repository';

import { CheckoutSessionItemRepository } from '../../domain/repositories/checkout-session-item.repository';

import { CheckoutSessionNotFoundException } from '../../domain/exceptions/checkout-session-not-found.exception';

import { CheckoutSessionDomainService } from '../../domain/services/checkout-session-domain.service';

import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';

@Injectable()
export class CompleteCheckoutSessionUseCase {
  constructor(
    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_ITEM_REPO)
    private readonly checkoutSessionItemRepo: CheckoutSessionItemRepository,

    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    private readonly domainService: CheckoutSessionDomainService,
  ) {}

  async execute(input: {
    checkoutSessionId: string;

    paymentId?: string;

    paymentProvider?: string;
  }) {
    // =======================
    // 🔍 FIND SESSION
    // =======================

    const session = await this.checkoutSessionRepo.findById(input.checkoutSessionId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!session) {
      throw new CheckoutSessionNotFoundException({
        checkoutSessionId: input.checkoutSessionId,
      });
    }

    // =======================
    // 🛡 VALIDATE SESSION
    // =======================

    this.domainService.ensureSessionUsable(session);

    // =======================
    // 📦 GET ITEMS
    // =======================

    const items = await this.checkoutSessionItemRepo.findByCheckoutSessionId(session.id);

    // =======================
    // ❌ EMPTY SESSION
    // =======================

    if (items.length === 0) {
      throw new Error('Checkout session has no items');
    }

    // =======================
    // 🛒 FIND CART
    // =======================

    const cart = await this.cartRepo.findById(session.cartId);

    // =======================
    // ❌ CART NOT FOUND
    // =======================

    if (!cart) {
      throw new Error('Cart not found');
    }

    // =======================
    // 💳 STORE PAYMENT METADATA
    // =======================

    session.metadata = {
      ...session.metadata,

      payment: {
        id: input.paymentId,

        provider: input.paymentProvider,

        completedAt: new Date(),
      },

      rewards: {
        rewardCoinsUsed: session.rewardCoinsUsed,

        rewardDiscount: session.rewardDiscount,
      },
    };

    // =======================
    // 🔄 CONVERT CART
    // =======================

    cart.convert();

    // =======================
    // ✅ COMPLETE SESSION
    // =======================

    session.complete();

    // =======================
    // 💾 SAVE CART
    // =======================

    const convertedCart = await this.cartRepo.update(cart);

    // =======================
    // 💾 SAVE SESSION
    // =======================

    const completedSession = await this.checkoutSessionRepo.update(session);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: completedSession.id,

      status: completedSession.status,

      completedAt: completedSession.completedAt,

      payment: {
        id: input.paymentId,

        provider: input.paymentProvider,
      },

      cart: {
        id: convertedCart.id,

        status: convertedCart.status,
      },

      totals: {
        subtotal: completedSession.subtotal,

        couponDiscount: completedSession.couponDiscount,

        rewardDiscount: completedSession.rewardDiscount,

        rewardCoinsUsed: completedSession.rewardCoinsUsed,

        shippingCharge: completedSession.shippingCharge,

        tax: completedSession.tax,

        grandTotal: completedSession.grandTotal,

        totalSavings: completedSession.totalSavings,
      },

      itemCount: items.length,

      totalQuantity: items.reduce(
        (total, item) => total + item.quantity,

        0,
      ),

      updatedAt: completedSession.updatedAt,
    };
  }
}

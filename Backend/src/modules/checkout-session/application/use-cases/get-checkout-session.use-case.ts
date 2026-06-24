// src/modules/checkout-session/application/use-cases/get-checkout-session.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CheckoutSessionRepository } from '../../domain/repositories/checkout-session.repository';

import { CheckoutSessionItemRepository } from '../../domain/repositories/checkout-session-item.repository';

import { CheckoutSessionNotFoundException } from '../../domain/exceptions/checkout-session-not-found.exception';

import { InvalidCheckoutSessionException } from '../../domain/exceptions/invalid-checkout-session.exception';

import { CheckoutSessionOwnershipService } from '../services/checkout-session-ownership.service';

@Injectable()
export class GetCheckoutSessionUseCase {
  constructor(
    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_ITEM_REPO)
    private readonly checkoutSessionItemRepo: CheckoutSessionItemRepository,

    private readonly ownershipService: CheckoutSessionOwnershipService,
  ) {}

  async execute(input: {
    checkoutSessionId: string;

    userId?: string;

    guestId?: string;
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
    // 🔐 OWNERSHIP
    // =======================

    const canAccess = this.ownershipService.canAccess({
      session,

      userId: input.userId,

      guestId: input.guestId,
    });

    if (!canAccess) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Unauthorized access to checkout session',
      });
    }

    // =======================
    // 📦 GET ITEMS
    // =======================

    const items = await this.checkoutSessionItemRepo.findByCheckoutSessionId(session.id);

    // =======================
    // ⏳ EXPIRY
    // =======================

    const isExpired = session.isExpired();

    // =======================
    // 🕒 REMAINING TIME
    // =======================

    const remainingMs = Math.max(session.expiresAt.getTime() - Date.now(), 0);

    const remainingMinutes = Math.ceil(remainingMs / 1000 / 60);

    // =======================
    // 📊 TOTALS
    // =======================

    const totalQuantity = items.reduce(
      (total, item) => total + item.quantity,

      0,
    );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: session.id,

      status: session.status,

      isExpired,

      expiresAt: session.expiresAt,

      remainingMinutes,

      couponCode: session.couponCode,

      cart: {
        id: session.cartId,
      },

      totals: {
  subtotal: session.subtotal,

  couponDiscount:
    session.couponDiscount,

  rewardDiscount:
    session.rewardDiscount,

  rewardCoinsUsed:
    session.rewardCoinsUsed,

  shippingCharge:
    session.shippingCharge,

  tax: session.tax,

  grandTotal:
    session.grandTotal,

  totalSavings:
    session.totalSavings,
},
      items: items.map((item) => {
        const mrpTotal = (item.mrp ?? item.price) * item.quantity;

        const discount = mrpTotal - item.totalPrice;

        return {
          id: item.id,

          checkoutSessionId: item.checkoutSessionId,

          productId: item.productId,

          variantId: item.variantId,

          productName: item.productName,

          variant: {
            id: item.variantId,

            name: item.variantName,

            sku: item.sku,

            quantity: item.quantity,

            pricing: {
              sellingPrice: item.price,

              mrp: item.mrp ?? item.price,
            },

            images: {
              main: item.imageUrl,
            },
          },

          totals: {
            subtotal: item.totalPrice,

            mrpTotal,

            discount,
          },

          createdAt: item.createdAt,

          updatedAt: item.updatedAt,
        };
      }),

      // 🔥 frozen snapshot summary
      summary: {
        totalProducts: items.length,

        totalQuantity,

        subtotal: session.subtotal,

        mrpTotal: items.reduce(
          (total, item) => total + (item.mrp ?? item.price) * item.quantity,

          0,
        ),

        productDiscount: items.reduce(
          (total, item) => total + ((item.mrp ?? item.price) * item.quantity - item.totalPrice),

          0,
        ),

        couponDiscount:
  session.couponDiscount,

rewardDiscount:
  session.rewardDiscount,

rewardCoinsUsed:
  session.rewardCoinsUsed,

totalSavings:
  session.totalSavings,

        shipping: session.shippingCharge,

        tax: session.tax,

        grandTotal: session.grandTotal,

        isFreeShipping: session.shippingCharge === 0,
      },

      createdAt: session.createdAt,

      updatedAt: session.updatedAt,
    };
  }
}

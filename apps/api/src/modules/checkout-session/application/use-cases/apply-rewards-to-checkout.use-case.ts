import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ValidateRedemptionUseCase } from '@/modules/coins/application/use-cases/redemption/validate-redemption.use-case';

import { CheckoutSessionRepository } from '../../domain/repositories/checkout-session.repository';

import { CheckoutSessionItemRepository } from '../../domain/repositories/checkout-session-item.repository';

import { CheckoutSessionDomainService } from '../../domain/services/checkout-session-domain.service';

import { CheckoutSessionNotFoundException } from '../../domain/exceptions/checkout-session-not-found.exception';

import { CheckoutSessionSummaryService } from '../services/checkout-session-summary.service';

@Injectable()
export class ApplyRewardsToCheckoutUseCase {
  constructor(
    // =======================
    // 🛒 CHECKOUT SESSION
    // =======================

    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_ITEM_REPO)
    private readonly checkoutSessionItemRepo: CheckoutSessionItemRepository,

    private readonly checkoutSessionDomainService: CheckoutSessionDomainService,

    private readonly checkoutSummaryService: CheckoutSessionSummaryService,

    // =======================
    // 🪙 REWARDS
    // =======================

    private readonly validateRedemptionUseCase: ValidateRedemptionUseCase,
  ) {}

  async execute(input: {
    checkoutSessionId: string;

    userId: string;

    coins: number;
  }) {
    // =======================
    // 🔍 FIND SESSION
    // =======================

    const session = await this.checkoutSessionRepo.findById(input.checkoutSessionId);

    // =======================
    // ❌ SESSION NOT FOUND
    // =======================

    if (!session) {
      throw new CheckoutSessionNotFoundException({
        checkoutSessionId: input.checkoutSessionId,
      });
    }

    // =======================
    // 🛡 VALIDATE SESSION
    // =======================

    this.checkoutSessionDomainService.ensureSessionUsable(session);

    // =======================
    // 📦 GET ITEMS
    // =======================

    const items = await this.checkoutSessionItemRepo.findByCheckoutSessionId(session.id);

    // =======================
    // 💰 VALIDATE REWARDS
    // =======================

    const validation = await this.validateRedemptionUseCase.execute({
      userId: input.userId,

      coins: input.coins,

      orderAmount: session.grandTotal,
    });

    // =======================
    // 🪙 APPLY REWARDS
    // =======================

    session.applyRewards({
      coinsUsed: validation.redemption.requestedCoins,

      rewardDiscount: validation.redemption.redeemedAmount,
    });

    // =======================
    // 💰 RECALCULATE SUMMARY
    // =======================

    const summary = await this.checkoutSummaryService.build({
      items,

      couponDiscount: session.couponDiscount,

      rewardDiscount: session.rewardDiscount,

      shipping: session.shippingCharge,

      tax: session.tax,
    });

    // =======================
    // 🔄 SYNC SNAPSHOT
    // =======================

    session.grandTotal = summary.grandTotal;

    session.totalSavings = summary.totalSavings;

    // =======================
    // 💾 SAVE SESSION
    // =======================

    const updatedSession = await this.checkoutSessionRepo.update(session);

    // =======================
    // 💰 PAYABLES
    // =======================

    const payableBeforeRewards =
      summary.subtotal + summary.shipping + summary.tax - summary.couponDiscount;

    const payableAfterRewards = summary.grandTotal;

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      checkoutSessionId: updatedSession.id,

      status: updatedSession.status,

      expiresAt: updatedSession.expiresAt,

      // =======================
      // 🪙 REWARDS
      // =======================

      rewards: {
        redeemedCoins: updatedSession.rewardCoinsUsed ?? 0,

        redeemedAmount: updatedSession.rewardDiscount ?? 0,

        payableBeforeRewards,

        payableAfterRewards,
      },

      // =======================
      // 🛒 CART
      // =======================

      cart: {
        id: updatedSession.cartId,
        status: 'LOCKED',
        lockedAt: updatedSession.updatedAt,
        couponCode: updatedSession.couponCode,
      },

      // =======================
      // 📦 ITEMS
      // =======================

      items: items.map((item) => {
        const mrp = item.mrp ?? item.price;

        const mrpTotal = mrp * item.quantity;

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

              mrp,
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

      // =======================
      // 💰 SUMMARY
      // =======================

      summary,

      updatedAt: updatedSession.updatedAt,
    };
  }
}

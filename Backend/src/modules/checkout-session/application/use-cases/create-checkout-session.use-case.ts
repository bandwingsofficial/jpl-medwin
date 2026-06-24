// src/modules/checkout-session/application/use-cases/create-checkout-session.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Cart } from '@/modules/cart/domain/entities/cart.entity';

import { CartRepository } from '@/modules/cart/domain/repositories/cart.repository';

import { CartItemRepository } from '@/modules/cart/domain/repositories/cart-item.repository';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CartDomainService } from '@/modules/cart/domain/services/cart-domain.service';

import { CartNotFoundException } from '@/modules/cart/domain/exceptions/cart-not-found.exception';

import { CheckoutSession } from '../../domain/entities/checkout-session.entity';

import { CheckoutSessionItem } from '../../domain/entities/checkout-session-item.entity';

import { CheckoutSessionRepository } from '../../domain/repositories/checkout-session.repository';

import { CheckoutSessionItemRepository } from '../../domain/repositories/checkout-session-item.repository';

import { CheckoutSessionStatus } from '../../domain/enums/checkout-session-status.enum';

import { CheckoutSessionDomainService } from '../../domain/services/checkout-session-domain.service';

import { CheckoutSessionSummaryService } from '../services/checkout-session-summary.service';

@Injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    // =======================
    // 🛒 CART
    // =======================

    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    private readonly cartDomainService: CartDomainService,

    // =======================
    // 🎟 CHECKOUT SESSION
    // =======================

    @Inject(TOKENS.CHECKOUT_SESSION_REPO)
    private readonly checkoutSessionRepo: CheckoutSessionRepository,

    @Inject(TOKENS.CHECKOUT_SESSION_ITEM_REPO)
    private readonly checkoutSessionItemRepo: CheckoutSessionItemRepository,

    private readonly checkoutSessionDomainService: CheckoutSessionDomainService,

    private readonly checkoutSummaryService: CheckoutSessionSummaryService,
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
    // 🔁 EXISTING ACTIVE SESSION
    // =======================

    const existingSession =
      await this.checkoutSessionRepo.findActiveByCartId(cart.id);

    if (existingSession) {
      // =======================
      // ⏰ EXPIRED SESSION
      // =======================

      if (existingSession.isExpired()) {
        await this.checkoutSessionRepo.expire(existingSession.id);

        await this.cartRepo.unlock(cart.id);

        // sync memory
        cart.unlock();
      } else {
        // =======================
// 📦 EXISTING ITEMS
// =======================

const existingItems =
  await this.checkoutSessionItemRepo.findByCheckoutSessionId(
    existingSession.id,
  );

// =======================
// ♻️ RESET STALE DISCOUNTS
// =======================

existingSession.couponCode = undefined;

existingSession.couponDiscount = 0;

existingSession.rewardCoinsUsed = 0;

existingSession.rewardDiscount = 0;

await this.checkoutSessionRepo.update(
  existingSession,
);

        // =======================
        // 💰 SUMMARY
        // =======================

        const summary =
  this.checkoutSummaryService.build({
    items: existingItems,

    couponDiscount: 0,

    rewardDiscount: 0,

    tax: 0,
});

        // =======================
        // 🔁 REUSE RESPONSE
        // =======================

        return {
          checkoutSessionId: existingSession.id,

          status: existingSession.status,

          expiresAt: existingSession.expiresAt,

          reused: true,

          cart: {
            id: cart.id,

            status: cart.status,

            lockedAt: cart.lockedAt,

            couponCode: cart.couponCode,
          },

          items: existingItems.map((item) => {
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

          summary,

          createdAt: existingSession.createdAt,
        };
      }
    }

    // =======================
    // 🛡 VALIDATE CART
    // =======================

    this.cartDomainService.ensureCartUsable(cart);

    // =======================
    // 📦 GET CART ITEMS
    // =======================

    const cartItems = await this.cartItemRepo.findByCartId(cart.id);

    // =======================
    // ❌ EMPTY CART
    // =======================

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // =======================
    // 📦 VALIDATE PRODUCTS
    // =======================

    await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.productRepo.findFullById(item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productName}`);
        }

        const variant = product.variants.find(
          (v) => v.id === item.variantId,
        );

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        // stock validation
        this.cartDomainService.validateStock({
          requestedQuantity: item.quantity,

          availableQuantity: variant.quantity,

          variantId: variant.id,
        });
      }),
    );

    // =======================
    // 💰 BUILD SUMMARY
    // =======================

    const checkoutItemsPreview = cartItems.map(
      (item) =>
        new CheckoutSessionItem(
          crypto.randomUUID(),

          'preview',

          item.productId,

          item.variantId,

          item.quantity,

          item.productName,

          item.variantName,

          item.sku,

          item.imageUrl,

          item.price,

          item.mrp,

          item.price * item.quantity,
        ),
    );

    const summary = this.checkoutSummaryService.build({
  items: checkoutItemsPreview,

  couponDiscount: cart.couponDiscount ?? 0,

  rewardDiscount: 0,

  tax: 0,
});

    // =======================
    // 🎟 CREATE SESSION
    // =======================

    const checkoutSession = new CheckoutSession(
  crypto.randomUUID(),

  cart.id,

  cart.userId,

  cart.guestId,

  CheckoutSessionStatus.ACTIVE,

  cart.couponCode,

  summary.subtotal,

  summary.couponDiscount,

  0, // rewardCoinsUsed

  0, // rewardDiscount

  summary.shipping,

  0,

  summary.grandTotal,

  summary.totalSavings,

  this.checkoutSessionDomainService.calculateExpiryDate(15),

  {},
);

    // =======================
    // 💾 SAVE SESSION
    // =======================

    const savedSession =
      await this.checkoutSessionRepo.create(checkoutSession);

    // =======================
    // 📦 CREATE SESSION ITEMS
    // =======================

    const checkoutItems = cartItems.map(
      (item) =>
        new CheckoutSessionItem(
          crypto.randomUUID(),

          savedSession.id,

          item.productId,

          item.variantId,

          item.quantity,

          item.productName,

          item.variantName,

          item.sku,

          item.imageUrl,

          item.price,

          item.mrp,

          item.price * item.quantity,
        ),
    );

    // =======================
    // 💾 SAVE SESSION ITEMS
    // =======================

    await this.checkoutSessionItemRepo.createMany(checkoutItems);

    // =======================
    // 🔒 LOCK CART
    // =======================

    cart.lock();

    const lockedCart = await this.cartRepo.update(cart);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      checkoutSessionId: savedSession.id,

      status: savedSession.status,

      expiresAt: savedSession.expiresAt,

      reused: false,

      cart: {
        id: lockedCart.id,

        status: lockedCart.status,

        lockedAt: lockedCart.lockedAt,

        couponCode: lockedCart.couponCode,
      },

      items: checkoutItems.map((item) => {
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

      summary,

      createdAt: savedSession.createdAt,
    };
  }
}
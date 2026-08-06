// src/modules/cart/application/use-cases/create-checkout-session.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Cart } from '../../domain/entities/cart.entity';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartSummaryService } from '../services/cart-summary.service';

import { CartNotFoundException } from '../../domain/exceptions/cart-not-found.exception';

@Injectable()
export class CreateCheckoutSessionUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

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

    const validatedItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await this.productRepo.findFullById(item.productId);

        if (!product) {
          throw new Error(`Product not found: ${item.productName}`);
        }

        const variant = product.variants.find((v) => v.id === item.variantId);

        if (!variant) {
          throw new Error(`Variant not found: ${item.variantId}`);
        }

        // stock check
        this.domainService.validateStock({
          requestedQuantity: item.quantity,

          availableQuantity: variant.quantity,

          variantId: variant.id,
        });

        return {
          id: item.id,

          productId: item.productId,

          variantId: item.variantId,

          productName: item.productName,

          variantName: item.variantName,

          quantity: item.quantity,

          pricing: {
            sellingPrice: item.price,

            mrp: item.mrp ?? null,
          },

          stock: {
            available: variant.quantity,

            inStock: variant.quantity > 0,
          },
        };
      }),
    );

    // =======================
    // 💰 SUMMARY
    // =======================

    const summary = await this.summaryService.build({
      items: cartItems,

      couponDiscount: 0,
    });

    // =======================
    // 🔒 LOCK CART
    // =======================

    cart.lock();

    const lockedCart = await this.cartRepo.update(cart);

    // =======================
    // 🎟 CHECKOUT SESSION
    // =======================

    const checkoutSessionId = crypto.randomUUID();

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      checkoutSessionId,

      cart: {
        id: lockedCart.id,

        status: lockedCart.status,

        lockedAt: lockedCart.lockedAt,

        couponCode: lockedCart.couponCode,
      },

      items: validatedItems,

      summary,

      expiresIn: '15 minutes',

      createdAt: new Date(),
    };
  }
}

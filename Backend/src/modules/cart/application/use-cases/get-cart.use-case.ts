// src/modules/cart/application/use-cases/get-cart.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { Cart } from '../../domain/entities/cart.entity';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class GetCartUseCase {
  constructor(
    @Inject(TOKENS.CART_REPO)
    private readonly cartRepo: CartRepository,

    @Inject(TOKENS.CART_ITEM_REPO)
    private readonly cartItemRepo: CartItemRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

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
    // 📭 EMPTY CART
    // =======================

    if (!cart) {
      const summary = await this.summaryService.buildEmptySummary();

      return {
        id: null,

        status: null,

        totalItems: 0,

        totalQuantity: 0,

        cartItems: [],

        summary,

        createdAt: null,

        updatedAt: null,
      };
    }

    // =======================
    // 📦 CART ITEMS
    // =======================

    const items = await this.cartItemRepo.findByCartId(cart.id);

    // =======================
    // 🚀 ENRICH CART ITEMS
    // =======================

    const enrichedCartItems = await Promise.all(
      items.map(async (cartItem) => {
        const product = await this.productRepo.findFullById(cartItem.productId);

        if (!product) {
          return null;
        }

        const variant = product.variants.find((v) => v.id === cartItem.variantId);

        if (!variant) {
          return null;
        }

        return {
          id: cartItem.id,

          cartId: cartItem.cartId,

          productId: cartItem.productId,

          variantId: cartItem.variantId,

          productName: cartItem.productName,

          brandName: product.brand?.name ?? null,

          category: {
            main: product.category?.name ?? null,

            sub: product.subCategory?.name ?? null,

            mini: product.miniCategory?.name ?? null,
          },

          variant: {
            id: variant.id,

            name: variant.name,

            sku: variant.sku,

            quantity: cartItem.quantity,

            attributes: variant.attributes,

            pricing: {
              sellingPrice: cartItem.price,

              mrp: cartItem.mrp ?? null,

              purchasePrice: variant.purchasePrice ? Number(variant.purchasePrice) : null,
            },

            stock: {
              available: variant.quantity,

              inStock: variant.quantity > 0,
            },

            images: {
              main:
                variant.images?.[0]?.url ?? cartItem.imageUrl ?? product.images?.[0]?.url ?? null,
            },
          },

          totals: this.summaryService.buildItemSummary(cartItem),

          createdAt: cartItem.createdAt,

          updatedAt: cartItem.updatedAt,
        };
      }),
    );

    // =======================
    // 🧹 REMOVE NULLS
    // =======================

    const finalCartItems = enrichedCartItems.filter(Boolean);

    // =======================
    // 💰 SUMMARY
    // =======================

    const summary = await this.summaryService.build({
      items,

      couponDiscount: cart.couponDiscount,
    });

    // =======================
    // 🚀 FINAL RESPONSE
    // =======================

    return {
      id: cart.id,

      status: cart.status,

      couponId: cart.couponId,

      couponCode: cart.couponCode,

      couponDiscount: cart.couponDiscount,

      totalItems: summary.totalProducts,

      totalQuantity: summary.totalQuantity,

      cartItems: finalCartItems,

      summary,

      createdAt: cart.createdAt,

      updatedAt: cart.updatedAt,
    };
  }
}

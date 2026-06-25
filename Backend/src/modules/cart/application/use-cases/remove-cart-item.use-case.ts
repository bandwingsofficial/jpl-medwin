// src/modules/cart/application/use-cases/remove-cart-item.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartItemNotFoundException } from '../../domain/exceptions/cart-item-not-found.exception';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class RemoveCartItemUseCase {
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

  async execute(input: { itemId: string }) {
    // =======================
    // 📦 FIND ITEM
    // =======================

    const item = await this.cartItemRepo.findById(input.itemId);

    if (!item) {
      throw new CartItemNotFoundException({
        cartItemId: input.itemId,
      });
    }
    const existingCart = await this.cartRepo.findById(item.cartId);

    if (existingCart) {
      this.domainService.ensureCartUsable(existingCart);
    }

    // =======================
    // 🗑 REMOVE ITEM
    // =======================

    await this.cartItemRepo.delete(item.id);

    // =======================
    // 🛒 GET CART
    // =======================

    const cart = await this.cartRepo.findById(item.cartId);

    // =======================
    // 📭 CART DELETED?
    // =======================

    if (!cart) {
      return {
        id: null,

        status: null,

        totalItems: 0,

        totalQuantity: 0,

        cartItems: [],

        summary: {
          totalProducts: 0,

          totalQuantity: 0,

          subtotal: 0,

          mrpTotal: 0,

          productDiscount: 0,

          couponDiscount: 0,

          shipping: 0,

          tax: 0,

          grandTotal: 0,

          savings: 0,
        },

        createdAt: null,

        updatedAt: null,
      };
    }

    // =======================
    // 📦 GET REMAINING ITEMS
    // =======================

    const cartItems = await this.cartItemRepo.findByCartId(cart.id);

    // =======================
    // 🚀 ENRICH ITEMS
    // =======================

    const enrichedCartItems = await Promise.all(
      cartItems.map(async (cartItem) => {
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
      items: cartItems,
    });

    // =======================
    // 🚀 FINAL RESPONSE
    // =======================

    return {
      id: cart.id,

      status: cart.status,

      totalItems: summary.totalProducts,

      totalQuantity: summary.totalQuantity,

      cartItems: finalCartItems,

      summary,

      createdAt: cart.createdAt,

      updatedAt: cart.updatedAt,
    };
  }
}

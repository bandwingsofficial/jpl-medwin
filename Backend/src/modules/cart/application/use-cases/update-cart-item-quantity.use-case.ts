// src/modules/cart/application/use-cases/update-cart-item-quantity.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';
import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { CartItemNotFoundException } from '../../domain/exceptions/cart-item-not-found.exception';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class UpdateCartItemQuantityUseCase {
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
    itemId: string;

    quantity: number;
  }) {
    // =======================
    // 📦 FIND ITEM
    // =======================

    const item = await this.cartItemRepo.findById(input.itemId);

    if (!item) {
      throw new CartItemNotFoundException({
        cartItemId: input.itemId,
      });
    }

    const cart = await this.cartRepo.findById(item.cartId);

    if (cart) {
      this.domainService.ensureCartUsable(cart);
    }

    // =======================
    // 📦 PRODUCT
    // =======================

    const product = await this.productRepo.findFullById(item.productId);

    if (!product) {
      throw new Error('Product not found');
    }

    // =======================
    // 🔍 VARIANT
    // =======================

    const variant = product.variants.find((v) => v.id === item.variantId);

    if (!variant) {
      throw new Error('Variant not found');
    }

    // =======================
    // 📦 STOCK CHECK
    // =======================

    this.domainService.validateStock({
      requestedQuantity: input.quantity,

      availableQuantity: variant.quantity,

      variantId: variant.id,
    });

    // =======================
    // 🔄 UPDATE QUANTITY
    // =======================

    item.setQuantity(input.quantity);

    await this.cartItemRepo.update(item);

    // =======================
    // 📦 GET FULL CART ITEMS
    // =======================

    const cartItems = await this.cartItemRepo.findByCartId(item.cartId);

    // =======================
    // 🚀 ENRICH CART ITEMS
    // =======================

    const enrichedCartItems = await Promise.all(
      cartItems.map(async (cartItem) => {
        const fullProduct = await this.productRepo.findFullById(cartItem.productId);

        if (!fullProduct) {
          return null;
        }

        const fullVariant = fullProduct.variants.find((v) => v.id === cartItem.variantId);

        if (!fullVariant) {
          return null;
        }

        return {
          id: cartItem.id,

          cartId: cartItem.cartId,

          productId: cartItem.productId,

          variantId: cartItem.variantId,

          productName: cartItem.productName,

          brandName: fullProduct.brand?.name ?? null,

          category: {
            main: fullProduct.category?.name ?? null,

            sub: fullProduct.subCategory?.name ?? null,

            mini: fullProduct.miniCategory?.name ?? null,
          },

          variant: {
            id: fullVariant.id,

            name: fullVariant.name,

            sku: fullVariant.sku,

            quantity: cartItem.quantity,

            attributes: fullVariant.attributes,

            pricing: {
              sellingPrice: cartItem.price,

              mrp: cartItem.mrp ?? null,

              purchasePrice: fullVariant.purchasePrice ? Number(fullVariant.purchasePrice) : null,
            },

            stock: {
              available: fullVariant.quantity,

              inStock: fullVariant.quantity > 0,
            },

            images: {
              main:
                fullVariant.images?.[0]?.url ??
                cartItem.imageUrl ??
                fullProduct.images?.[0]?.url ??
                null,
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
      id: item.cartId,

      status: cart?.status ?? 'ACTIVE',

      totalItems: summary.totalProducts,

      totalQuantity: summary.totalQuantity,

      cartItems: finalCartItems,

      summary,
    };
  }
}

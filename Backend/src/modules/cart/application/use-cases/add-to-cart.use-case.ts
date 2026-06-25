// src/modules/cart/application/use-cases/add-to-cart.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CartRepository } from '../../domain/repositories/cart.repository';

import { CartItemRepository } from '../../domain/repositories/cart-item.repository';

import { CartDomainService } from '../../domain/services/cart-domain.service';

import { Cart } from '../../domain/entities/cart.entity';

import { CartItem } from '../../domain/entities/cart-item.entity';

import { CartStatus } from '../../domain/enums/cart-status.enum';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { VariantNotFoundException } from '../../domain/exceptions/variant-not-found.exception';

import { CartSummaryService } from '../services/cart-summary.service';

@Injectable()
export class AddToCartUseCase {
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

    productId: string;

    variantId: string;

    quantity: number;
  }) {
    // =======================
    // 🛒 GET / CREATE CART
    // =======================

    let cart: Cart | null = null;

    if (input.userId) {
      cart = await this.cartRepo.findActiveByUserId(input.userId);
    } else if (input.guestId) {
      cart = await this.cartRepo.findActiveByGuestId(input.guestId);
    }

    // =======================
    // 🆕 CREATE CART
    // =======================

    if (!cart) {
      cart = new Cart(
        crypto.randomUUID(),

        input.userId,

        input.guestId,

        CartStatus.ACTIVE,
      );

      cart = await this.cartRepo.create(cart);
    }

    // =======================
    // 🛡 VALIDATE CART
    // =======================

    this.domainService.ensureCartUsable(cart);

    // =======================
    // 📦 PRODUCT
    // =======================

    const product = await this.productRepo.findFullById(input.productId);

    if (!product) {
      throw new ProductNotFoundException({
        productId: input.productId,
      });
    }

    // =======================
    // 🔍 VARIANT
    // =======================

    const variant = product.variants.find((v) => v.id === input.variantId);

    if (!variant) {
      throw new VariantNotFoundException({
        variantId: input.variantId,
        productId: input.productId,
      });
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
    // 🔍 EXISTING ITEM
    // =======================

    let item = await this.cartItemRepo.findByVariantId({
      cartId: cart.id,

      variantId: variant.id,
    });

    // =======================
    // 🔄 UPDATE EXISTING
    // =======================

    if (item) {
      const finalQuantity = item.quantity + input.quantity;

      this.domainService.validateStock({
        requestedQuantity: finalQuantity,

        availableQuantity: variant.quantity,

        variantId: variant.id,
      });

      item.setQuantity(finalQuantity);

      item = await this.cartItemRepo.update(item);
    }

    // =======================
    // 🆕 CREATE ITEM
    // =======================
    else {
      const newItem = new CartItem(
        crypto.randomUUID(),

        cart.id,

        product.id,

        variant.id,

        input.quantity,

        product.name,

        variant.name,

        variant.sku ?? undefined,

        variant.images?.[0]?.url ?? undefined,

        Number(variant.sellingPrice),

        variant.mrp ? Number(variant.mrp) : undefined,
      );

      item = await this.cartItemRepo.create(newItem);
    }

    // =======================
    // 📦 GET FULL CART ITEMS
    // =======================

    const cartItems = await this.cartItemRepo.findByCartId(cart.id);

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

      couponDiscount: cart.couponDiscount,
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

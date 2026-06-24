// src/modules/wishlist/application/use-cases/get-wishlist.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { WishlistRepository } from '../../domain/repositories/wishlist.repository';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { ProductResponseMapper } from '@/modules/product/infrastructure/persistence/prisma/mappers/product-response.mapper';

@Injectable()
export class GetWishlistUseCase {
  constructor(
    @Inject(TOKENS.WISHLIST_REPO)
    private readonly wishlistRepo: WishlistRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(userId: string) {
    // =======================
    // ❤️ WISHLIST
    // =======================

    const wishlists =
      await this.wishlistRepo.findByUserId(userId);

    // =======================
    // 📦 PRODUCTS
    // =======================

    const items = await Promise.all(
      wishlists.map(async (wishlist) => {
        const product =
          await this.productRepo.findFullById(
            wishlist.productId,
          );

        if (!product) {
          return null;
        }

        return {
          ...ProductResponseMapper.map(product),

          wishlist: {
            id: wishlist.id,

            addedAt: wishlist.createdAt,
          },
        };
      }),
    );

    // =======================
    // 🚀 RESPONSE
    // =======================

    const validItems = items.filter(Boolean);

    return {
      totalItems: validItems.length,

      items: validItems,
    };
  }
}
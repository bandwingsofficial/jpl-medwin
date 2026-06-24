// src/modules/wishlist/application/use-cases/add-to-wishlist.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { WishlistRepository } from '../../domain/repositories/wishlist.repository';

import { Wishlist } from '../../domain/entities/wishlist.entity';

import { WishlistAlreadyExistsException } from '../../domain/exceptions/wishlist-already-exists.exception';

import { WishlistProductNotFoundException } from '../../domain/exceptions/wishlist-product-not-found.exception';

@Injectable()
export class AddToWishlistUseCase {
  constructor(
    @Inject(TOKENS.WISHLIST_REPO)
    private readonly wishlistRepo: WishlistRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(input: {
    userId: string;

    productId: string;
  }) {
    // =======================
    // 📦 PRODUCT
    // =======================

    const product = await this.productRepo.findById(
      input.productId,
    );

    if (!product) {
      throw new WishlistProductNotFoundException({
        productId: input.productId,
      });
    }

    // =======================
    // ❤️ EXISTS
    // =======================

    const existing =
      await this.wishlistRepo.findByUserAndProduct(
        input.userId,
        input.productId,
      );

    if (existing && !existing.isDeleted()) {
      throw new WishlistAlreadyExistsException({
        userId: input.userId,
        productId: input.productId,
      });
    }

    // =======================
    // ♻️ RESTORE
    // =======================

    if (existing && existing.isDeleted()) {
      existing.restore();

      const restored =
        await this.wishlistRepo.update(existing);

      return restored;
    }

    // =======================
    // 🆕 CREATE
    // =======================

    const wishlist = new Wishlist(
      crypto.randomUUID(),

      input.userId,

      input.productId,
    );

    return this.wishlistRepo.create(wishlist);
  }
}
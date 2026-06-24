// src/modules/wishlist/application/use-cases/remove-from-wishlist.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { WishlistRepository } from '../../domain/repositories/wishlist.repository';

import { WishlistNotFoundException } from '../../domain/exceptions/wishlist-not-found.exception';

@Injectable()
export class RemoveFromWishlistUseCase {
  constructor(
    @Inject(TOKENS.WISHLIST_REPO)
    private readonly wishlistRepo: WishlistRepository,
  ) {}

  async execute(input: {
    userId: string;

    productId: string;
  }): Promise<void> {
    // =======================
    // ❤️ FIND
    // =======================

    const wishlist =
      await this.wishlistRepo.findByUserAndProduct(
        input.userId,
        input.productId,
      );

    if (!wishlist || wishlist.isDeleted()) {
      throw new WishlistNotFoundException({
        userId: input.userId,
        productId: input.productId,
      });
    }

    // =======================
    // ❌ DELETE
    // =======================

    wishlist.softDelete();

    await this.wishlistRepo.update(wishlist);
  }
}
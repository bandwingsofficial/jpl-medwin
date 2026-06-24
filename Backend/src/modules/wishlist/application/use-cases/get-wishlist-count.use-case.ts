// src/modules/wishlist/application/use-cases/get-wishlist-count.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { WishlistRepository } from '../../domain/repositories/wishlist.repository';

@Injectable()
export class GetWishlistCountUseCase {
  constructor(
    @Inject(TOKENS.WISHLIST_REPO)
    private readonly wishlistRepo: WishlistRepository,
  ) {}

  async execute(userId: string) {
    const count =
      await this.wishlistRepo.countByUserId(
        userId,
      );

    return {
      count,
    };
  }
}
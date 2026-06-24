// src/modules/wishlist/infrastructure/persistence/prisma/mappers/wishlist.mapper.ts

import { Wishlist as PrismaWishlist } from '@prisma/client';

import { Wishlist } from '../../../../domain/entities/wishlist.entity';

export class WishlistMapper {
  // =======================
  // ❤️ WISHLIST
  // =======================

  static toDomain(
    p: PrismaWishlist,
  ): Wishlist {
    return new Wishlist(
      p.id,

      p.userId,

      p.productId,

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(
    e: Wishlist,
  ) {
    return {
      id: e.id,

      userId: e.userId,

      productId: e.productId,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}
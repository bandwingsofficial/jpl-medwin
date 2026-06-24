// src/modules/wishlist/infrastructure/persistence/prisma/repositories/prisma-wishlist.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { WishlistRepository } from '../../../../domain/repositories/wishlist.repository';

import { Wishlist } from '../../../../domain/entities/wishlist.entity';

import { WishlistMapper } from '../mappers/wishlist.mapper';

@Injectable()
export class PrismaWishlistRepository implements WishlistRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(
    id: string,
  ): Promise<Wishlist | null> {
    const data = await this.prisma.wishlist.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return data
      ? WishlistMapper.toDomain(data)
      : null;
  }

  async findByUserId(
    userId: string,
  ): Promise<Wishlist[]> {
    const data =
      await this.prisma.wishlist.findMany({
        where: {
          userId,
          deletedAt: null,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return data.map((item) =>
      WishlistMapper.toDomain(item),
    );
  }

  async findByUserAndProduct(
  userId: string,
  productId: string,
): Promise<Wishlist | null> {
  const data =
    await this.prisma.wishlist.findFirst({
      where: {
        userId,
        productId,
      },
    });

  return data
    ? WishlistMapper.toDomain(data)
    : null;
}

  // =======================
  // 🧠 CHECKS
  // =======================

  async exists(
    userId: string,
    productId: string,
  ): Promise<boolean> {
    const count =
      await this.prisma.wishlist.count({
        where: {
          userId,
          productId,
          deletedAt: null,
        },
      });

    return count > 0;
  }

  async countByUserId(
    userId: string,
  ): Promise<number> {
    return this.prisma.wishlist.count({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(
    wishlist: Wishlist,
  ): Promise<Wishlist> {
    const data =
      await this.prisma.wishlist.create({
        data: WishlistMapper.toPersistence(
          wishlist,
        ),
      });

    return WishlistMapper.toDomain(data);
  }

  async update(
    wishlist: Wishlist,
  ): Promise<Wishlist> {
    const data =
      await this.prisma.wishlist.update({
        where: {
          id: wishlist.id,
        },

        data: WishlistMapper.toPersistence(
          wishlist,
        ),
      });

    return WishlistMapper.toDomain(data);
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(
    id: string,
  ): Promise<void> {
    await this.prisma.wishlist.update({
      where: { id },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(
    id: string,
  ): Promise<void> {
    await this.prisma.wishlist.update({
      where: { id },

      data: {
        deletedAt: null,
      },
    });
  }
}
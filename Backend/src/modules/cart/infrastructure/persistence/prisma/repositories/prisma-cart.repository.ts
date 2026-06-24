// src/modules/cart/infrastructure/persistence/prisma/repositories/prisma-cart.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CartRepository } from '../../../../domain/repositories/cart.repository';

import { Cart } from '../../../../domain/entities/cart.entity';

import { CartStatus } from '../../../../domain/enums/cart-status.enum';

import { CartMapper } from '../mappers/cart.mapper';

@Injectable()
export class PrismaCartRepository implements CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Cart | null> {
    const data = await this.prisma.cart.findFirst({
      where: {
        id,

        deletedAt: null,
      },
    });

    return data ? CartMapper.toDomain(data) : null;
  }

  async findActiveByUserId(userId: string): Promise<Cart | null> {
    const data = await this.prisma.cart.findFirst({
      where: {
        userId,

        status: {
          in: [CartStatus.ACTIVE, CartStatus.LOCKED],
        },

        deletedAt: null,
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return data ? CartMapper.toDomain(data) : null;
  }

  async findActiveByGuestId(guestId: string): Promise<Cart | null> {
    const data = await this.prisma.cart.findFirst({
      where: {
        guestId,

        status: {
          in: [CartStatus.ACTIVE, CartStatus.LOCKED],
        },

        deletedAt: null,
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return data ? CartMapper.toDomain(data) : null;
  }

  async findByUserId(userId: string): Promise<Cart[]> {
    const data = await this.prisma.cart.findMany({
      where: {
        userId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CartMapper.toDomain(c));
  }

  async findByGuestId(guestId: string): Promise<Cart[]> {
    const data = await this.prisma.cart.findMany({
      where: {
        guestId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CartMapper.toDomain(c));
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsActiveCartByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.cart.count({
      where: {
        userId,

        status: CartStatus.ACTIVE,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsActiveCartByGuestId(guestId: string): Promise<boolean> {
    const count = await this.prisma.cart.count({
      where: {
        guestId,

        status: CartStatus.ACTIVE,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(cart: Cart): Promise<Cart> {
    const data = await this.prisma.cart.create({
      data: CartMapper.toPersistence(cart),
    });

    return CartMapper.toDomain(data);
  }

  async update(cart: Cart): Promise<Cart> {
    const data = await this.prisma.cart.update({
      where: {
        id: cart.id,
      },

      data: CartMapper.toPersistence(cart),
    });

    return CartMapper.toDomain(data);
  }

  // =======================
  // 🔄 STATUS
  // =======================

  async updateStatus(params: {
    cartId: string;

    status: CartStatus;
  }): Promise<void> {
    await this.prisma.cart.update({
      where: {
        id: params.cartId,
      },

      data: {
        status: params.status,
      },
    });
  }

  async lock(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        status: CartStatus.LOCKED,

        lockedAt: new Date(),
      },
    });
  }

  async unlock(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        status: CartStatus.ACTIVE,

        lockedAt: null,
      },
    });
  }

  async convert(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        status: CartStatus.CONVERTED,
      },
    });
  }

  async expire(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        status: CartStatus.EXPIRED,
      },
    });
  }

  async abandon(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        status: CartStatus.ABANDONED,
      },
    });
  }

  async merge(params: {
    sourceCartId: string;

    targetCartId: string;
  }): Promise<void> {
    await this.prisma.cart.update({
      where: {
        id: params.sourceCartId,
      },

      data: {
        status: CartStatus.MERGED,

        mergedIntoCartId: params.targetCartId,
      },
    });
  }

  // =======================
  // 🎟 COUPON
  // =======================

  async applyCoupon(params: {
    cartId: string;

    couponId: string;

    couponCode: string;

    couponDiscount: number;
  }): Promise<void> {
    await this.prisma.cart.update({
      where: {
        id: params.cartId,
      },

      data: {
        couponId: params.couponId,

        couponCode: params.couponCode,

        couponDiscount: params.couponDiscount,
      },
    });
  }

  async removeCoupon(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: {
        id: cartId,
      },

      data: {
        couponId: null,

        couponCode: null,

        couponDiscount: null,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(cartId: string): Promise<void> {
    await this.prisma.cart.update({
      where: { id: cartId },

      data: {
        deletedAt: null,
      },
    });
  }
}

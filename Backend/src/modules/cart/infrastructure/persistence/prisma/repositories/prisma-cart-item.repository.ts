// src/modules/cart/infrastructure/persistence/prisma/repositories/prisma-cart-item.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CartItemRepository } from '../../../../domain/repositories/cart-item.repository';

import { CartItem } from '../../../../domain/entities/cart-item.entity';

import { CartItemMapper } from '../mappers/cart-item.mapper';

@Injectable()
export class PrismaCartItemRepository implements CartItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CartItem | null> {
    const data = await this.prisma.cartItem.findFirst({
      where: {
        id,

        deletedAt: null,
      },
    });

    return data ? CartItemMapper.toDomain(data) : null;
  }

  async findByCartId(cartId: string): Promise<CartItem[]> {
    const data = await this.prisma.cartItem.findMany({
      where: {
        cartId,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return data.map((i) => CartItemMapper.toDomain(i));
  }

  async findByVariantId(params: {
    cartId: string;

    variantId: string;
  }): Promise<CartItem | null> {
    const data = await this.prisma.cartItem.findFirst({
      where: {
        cartId: params.cartId,

        variantId: params.variantId,

        deletedAt: null,
      },
    });

    return data ? CartItemMapper.toDomain(data) : null;
  }

  async existsByVariantId(params: {
    cartId: string;

    variantId: string;
  }): Promise<boolean> {
    const count = await this.prisma.cartItem.count({
      where: {
        cartId: params.cartId,

        variantId: params.variantId,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  async create(item: CartItem): Promise<CartItem> {
    const data = await this.prisma.cartItem.create({
      data: CartItemMapper.toPersistence(item),
    });

    return CartItemMapper.toDomain(data);
  }

  async update(item: CartItem): Promise<CartItem> {
    const data = await this.prisma.cartItem.update({
      where: {
        id: item.id,
      },

      data: CartItemMapper.toPersistence(item),
    });

    return CartItemMapper.toDomain(data);
  }

  async createMany(items: CartItem[]): Promise<void> {
    await this.prisma.cartItem.createMany({
      data: items.map((i) => CartItemMapper.toPersistence(i)),
    });
  }

  async updateMany(items: CartItem[]): Promise<void> {
    await Promise.all(items.map((item) => this.update(item)));
  }

  async increaseQuantity(params: {
    itemId: string;

    quantity?: number;
  }): Promise<void> {
    await this.prisma.cartItem.update({
      where: {
        id: params.itemId,
      },

      data: {
        quantity: {
          increment: params.quantity ?? 1,
        },
      },
    });
  }

  async decreaseQuantity(params: {
    itemId: string;

    quantity?: number;
  }): Promise<void> {
    await this.prisma.cartItem.update({
      where: {
        id: params.itemId,
      },

      data: {
        quantity: {
          decrement: params.quantity ?? 1,
        },
      },
    });
  }

  async setQuantity(params: {
    itemId: string;

    quantity: number;
  }): Promise<void> {
    await this.prisma.cartItem.update({
      where: {
        id: params.itemId,
      },

      data: {
        quantity: params.quantity,
      },
    });
  }

  async clearCart(cartId: string): Promise<void> {
    await this.prisma.cartItem.updateMany({
      where: {
        cartId,

        deletedAt: null,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async softDelete(itemId: string): Promise<void> {
    await this.prisma.cartItem.update({
      where: { id: itemId },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(itemId: string): Promise<void> {
    await this.prisma.cartItem.update({
      where: { id: itemId },

      data: {
        deletedAt: null,
      },
    });
  }

  async delete(itemId: string): Promise<void> {
    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async deleteByVariantId(variantId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: {
        variantId,
      },
    });
  }

  async deleteByProductId(productId: string): Promise<void> {
    await this.prisma.cartItem.deleteMany({
      where: {
        productId,
      },
    });
  }
}

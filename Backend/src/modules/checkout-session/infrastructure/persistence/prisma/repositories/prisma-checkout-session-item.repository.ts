// src/modules/checkout-session/infrastructure/persistence/prisma/repositories/prisma-checkout-session-item.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CheckoutSessionItemRepository } from '../../../../domain/repositories/checkout-session-item.repository';

import { CheckoutSessionItem } from '../../../../domain/entities/checkout-session-item.entity';

import { CheckoutSessionItemMapper } from '../mappers/checkout-session-item.mapper';

@Injectable()
export class PrismaCheckoutSessionItemRepository implements CheckoutSessionItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<CheckoutSessionItem | null> {
    const data = await this.prisma.checkoutSessionItem.findFirst({
      where: {
        id,
      },
    });

    return data ? CheckoutSessionItemMapper.toDomain(data) : null;
  }

  async findByCheckoutSessionId(checkoutSessionId: string): Promise<CheckoutSessionItem[]> {
    const data = await this.prisma.checkoutSessionItem.findMany({
      where: {
        checkoutSessionId,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return data.map((item) => CheckoutSessionItemMapper.toDomain(item));
  }

  async findByVariantId(params: {
    checkoutSessionId: string;

    variantId: string;
  }): Promise<CheckoutSessionItem | null> {
    const data = await this.prisma.checkoutSessionItem.findFirst({
      where: {
        checkoutSessionId: params.checkoutSessionId,

        variantId: params.variantId,
      },
    });

    return data ? CheckoutSessionItemMapper.toDomain(data) : null;
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsByVariantId(params: {
    checkoutSessionId: string;

    variantId: string;
  }): Promise<boolean> {
    const count = await this.prisma.checkoutSessionItem.count({
      where: {
        checkoutSessionId: params.checkoutSessionId,

        variantId: params.variantId,
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(item: CheckoutSessionItem): Promise<CheckoutSessionItem> {
    const data = await this.prisma.checkoutSessionItem.create({
      data: CheckoutSessionItemMapper.toPersistence(item),
    });

    return CheckoutSessionItemMapper.toDomain(data);
  }

  async createMany(items: CheckoutSessionItem[]): Promise<void> {
    if (items.length === 0) {
      return;
    }

    await this.prisma.checkoutSessionItem.createMany({
      data: items.map((item) => CheckoutSessionItemMapper.toPersistence(item)),
    });
  }

  async update(item: CheckoutSessionItem): Promise<CheckoutSessionItem> {
    const data = await this.prisma.checkoutSessionItem.update({
      where: {
        id: item.id,
      },

      data: CheckoutSessionItemMapper.toPersistence(item),
    });

    return CheckoutSessionItemMapper.toDomain(data);
  }

  async updateMany(items: CheckoutSessionItem[]): Promise<void> {
    if (items.length === 0) {
      return;
    }

    await Promise.all(
      items.map((item) =>
        this.prisma.checkoutSessionItem.update({
          where: {
            id: item.id,
          },

          data: CheckoutSessionItemMapper.toPersistence(item),
        }),
      ),
    );
  }

  // =======================
  // ❌ DELETE
  // =======================

  async delete(itemId: string): Promise<void> {
    await this.prisma.checkoutSessionItem.delete({
      where: {
        id: itemId,
      },
    });
  }
}

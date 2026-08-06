// src/modules/order/infrastructure/persistence/prisma/repositories/prisma-order-item.repository.ts

import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { OrderItemRepository } from '../../../../domain/repositories/order-item.repository';

import { OrderItem } from '../../../../domain/entities/order-item.entity';

import { OrderItemMapper } from '../mappers/order-item.mapper';

@Injectable()
export class PrismaOrderItemRepository implements OrderItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<OrderItem | null> {
    const item = await this.prisma.orderItem.findUnique({
      where: { id },
    });

    return item ? OrderItemMapper.toDomain(item) : null;
  }

  async findByOrderId(orderId: string): Promise<OrderItem[]> {
    const items = await this.prisma.orderItem.findMany({
      where: {
        orderId,

        deletedAt: null,
      },
    });

    return items.map((i) => OrderItemMapper.toDomain(i));
  }

  async findByVariantId(params: {
    orderId: string;

    variantId: string;
  }): Promise<OrderItem | null> {
    const item = await this.prisma.orderItem.findFirst({
      where: {
        orderId: params.orderId,

        variantId: params.variantId,

        deletedAt: null,
      },
    });

    return item ? OrderItemMapper.toDomain(item) : null;
  }

  async existsByVariantId(params: {
    orderId: string;

    variantId: string;
  }): Promise<boolean> {
    const count = await this.prisma.orderItem.count({
      where: {
        orderId: params.orderId,

        variantId: params.variantId,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  async create(item: OrderItem): Promise<OrderItem> {
    const created = await this.prisma.orderItem.create({
      data: OrderItemMapper.toPersistence(item),
    });

    return OrderItemMapper.toDomain(created);
  }

  async createMany(items: OrderItem[], tx: Prisma.TransactionClient = this.prisma): Promise<void> {
    if (!items.length) {
      return;
    }

    await tx.orderItem.createMany({
      data: items.map((i) => OrderItemMapper.toPersistence(i)),
    });
  }

  async update(item: OrderItem): Promise<OrderItem> {
    const updated = await this.prisma.orderItem.update({
      where: { id: item.id },

      data: OrderItemMapper.toPersistence(item),
    });

    return OrderItemMapper.toDomain(updated);
  }

  async updateMany(): Promise<void> {
    return;
  }

  async softDelete(itemId: string): Promise<void> {
    await this.prisma.orderItem.update({
      where: { id: itemId },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(itemId: string): Promise<void> {
    await this.prisma.orderItem.update({
      where: { id: itemId },

      data: {
        deletedAt: null,
      },
    });
  }

  async delete(itemId: string): Promise<void> {
    await this.prisma.orderItem.delete({
      where: { id: itemId },
    });
  }

  // =======================
  // 📊 DASHBOARD
  // =======================

  async findByOrderIds(orderIds: string[]): Promise<OrderItem[]> {
    if (!orderIds.length) {
      return [];
    }

    const items = await this.prisma.orderItem.findMany({
      where: {
        orderId: {
          in: orderIds,
        },

        deletedAt: null,
      },
    });

    return items.map((item) => OrderItemMapper.toDomain(item));
  }
}

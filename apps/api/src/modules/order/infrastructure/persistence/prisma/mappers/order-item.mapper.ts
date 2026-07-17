// src/modules/order/infrastructure/persistence/prisma/mappers/order-item.mapper.ts

import { OrderItem as PrismaOrderItem } from '@prisma/client';

import { OrderItem } from '../../../../domain/entities/order-item.entity';

export class OrderItemMapper {
  // =======================
  // 🧾 TO DOMAIN
  // =======================

  static toDomain(p: PrismaOrderItem): OrderItem {
    return new OrderItem(
      p.id,

      p.orderId,

      p.productId,

      p.variantId,

      p.productName,

      p.variantName ?? undefined,

      p.sku ?? undefined,

      p.imageUrl ?? undefined,

      p.quantity,

      Number(p.price),

      p.mrp ? Number(p.mrp) : undefined,

      Number(p.totalPrice),

      p.totalMrp ? Number(p.totalMrp) : undefined,

      p.totalSavings ? Number(p.totalSavings) : undefined,

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  // =======================
  // 💾 TO PERSISTENCE
  // =======================

  static toPersistence(e: OrderItem) {
    return {
      id: e.id,

      orderId: e.orderId,

      productId: e.productId,

      variantId: e.variantId,

      productName: e.productName,

      variantName: e.variantName ?? null,

      sku: e.sku ?? null,

      imageUrl: e.imageUrl ?? null,

      quantity: e.quantity,

      price: e.price,

      mrp: e.mrp ?? null,

      totalPrice: e.totalPrice,

      totalMrp: e.totalMrp ?? null,

      totalSavings: e.totalSavings ?? null,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}

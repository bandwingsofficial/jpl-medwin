// src/modules/order/domain/repositories/order-item.repository.ts

import { Prisma } from '@prisma/client';

import { OrderItem } from '../entities/order-item.entity';

export interface OrderItemRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<OrderItem | null>;

  findByOrderId(orderId: string): Promise<OrderItem[]>;

  findByVariantId(params: {
    orderId: string;

    variantId: string;
  }): Promise<OrderItem | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsByVariantId(params: {
    orderId: string;

    variantId: string;
  }): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(item: OrderItem): Promise<OrderItem>;

  createMany(items: OrderItem[], tx?: Prisma.TransactionClient): Promise<void>;

  update(item: OrderItem): Promise<OrderItem>;

  updateMany(items: OrderItem[]): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(itemId: string): Promise<void>;

  restore(itemId: string): Promise<void>;

  delete(itemId: string): Promise<void>;

  // =======================
  // 📊 DASHBOARD
  // =======================

  findByOrderIds(orderIds: string[]): Promise<OrderItem[]>;
}

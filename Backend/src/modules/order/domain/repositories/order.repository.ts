// src/modules/order/domain/repositories/order.repository.ts
import { Prisma } from '@prisma/client';
import { Order } from '../entities/order.entity';

import { OrderStatus } from '../enums/order-status.enum';

import { PaymentStatus } from '../enums/payment-status.enum';

export interface OrderRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string, tx?: Prisma.TransactionClient): Promise<Order | null>;

  findByOrderNumber(orderNumber: string): Promise<Order | null>;

  findByCheckoutSessionId(checkoutSessionId: string): Promise<Order | null>;

  findByCartId(cartId: string): Promise<Order[]>;

  findByUserId(userId: string): Promise<Order[]>;

  findByStatus(status: OrderStatus): Promise<Order[]>;

  findPendingPaymentOrders(): Promise<Order[]>;
  findMany(params: {
    page?: number;

    limit?: number;

    search?: string;

    status?: OrderStatus;

    paymentStatus?: PaymentStatus;

    userId?: string;

    from?: Date;

    to?: Date;

    sortBy?: string;

    sortOrder?: 'asc' | 'desc';
  }): Promise<{
    data: Order[];

    total: number;
  }>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsByOrderNumber(orderNumber: string): Promise<boolean>;

  existsByCheckoutSessionId(checkoutSessionId: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(order: Order, tx?: Prisma.TransactionClient): Promise<Order>;

  update(order: Order): Promise<Order>;

  createMany(orders: Order[]): Promise<void>;

  updateMany(orders: Order[]): Promise<void>;

  // =======================
  // 📦 STATUS
  // =======================

  updateStatus(params: {
    orderId: string;

    status: OrderStatus;
  }): Promise<void>;

  confirm(orderId: string): Promise<void>;

  process(orderId: string): Promise<void>;

  ship(orderId: string): Promise<void>;

  deliver(orderId: string): Promise<void>;

  cancel(params: {
    orderId: string;

    reason?: string;
  }): Promise<void>;

  refund(orderId: string): Promise<void>;

  // =======================
  // 💳 PAYMENT
  // =======================

  updatePaymentStatus(params: {
    orderId: string;

    paymentStatus: PaymentStatus;
  }): Promise<void>;

  markPaymentSuccess(orderId: string): Promise<void>;

  markPaymentFailed(orderId: string): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(orderId: string): Promise<void>;

  restore(orderId: string): Promise<void>;
  // =======================
  // 📊 DASHBOARD
  // =======================

  findByPeriod(params: { from?: Date; to?: Date }): Promise<Order[]>;

  countByStatus(params: { status: OrderStatus; from?: Date; to?: Date }): Promise<number>;

  findManyForExport(params: {
  search?: string;

  status?: OrderStatus;

  paymentStatus?: PaymentStatus;

  userId?: string;

  from?: Date;

  to?: Date;

  sortBy?: string;

  sortOrder?: 'asc' | 'desc';
}): Promise<any[]>;
}

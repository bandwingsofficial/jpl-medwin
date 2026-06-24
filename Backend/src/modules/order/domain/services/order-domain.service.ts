// src/modules/order/domain/services/order-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Order } from '../entities/order.entity';

import { OrderItem } from '../entities/order-item.entity';

import { OrderStatus } from '../enums/order-status.enum';

import { PaymentStatus } from '../enums/payment-status.enum';

import { InvalidOrderOperationException } from '../exceptions/invalid-order-operation.exception';

import { OrderCancelledException } from '../exceptions/order-cancelled.exception';

@Injectable()
export class OrderDomainService {
  // =======================
  // 🛡 ORDER VALIDATION
  // =======================

  ensureOrderUsable(order: Order) {
    // deleted
    if (order.isDeleted()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'use',

        reason: 'Order is deleted',
      });
    }

    // cancelled
    if (order.isCancelled()) {
      throw new OrderCancelledException({
        orderId: order.id,
      });
    }
  }

  // =======================
  // 💳 PAYMENT VALIDATION
  // =======================

  ensurePaymentPending(order: Order) {
    if (order.paymentStatus !== PaymentStatus.PENDING) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'payment',

        reason: 'Order payment is not pending',
      });
    }
  }

  ensurePaymentCompleted(order: Order) {
    if (!order.isPaid()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'payment',

        reason: 'Payment is not completed',
      });
    }
  }

  // =======================
  // 📦 STATUS VALIDATION
  // =======================

  ensureCanConfirm(order: Order) {
    if (order.status !== OrderStatus.PENDING_PAYMENT) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'confirm',

        reason: 'Only pending payment orders can be confirmed',
      });
    }

    this.ensurePaymentCompleted(order);
  }

  ensureCanProcess(order: Order) {
    if (order.status !== OrderStatus.CONFIRMED) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'process',

        reason: 'Only confirmed orders can be processed',
      });
    }
  }

  ensureCanShip(order: Order) {
    if (order.status !== OrderStatus.PROCESSING) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'ship',

        reason: 'Only processing orders can be shipped',
      });
    }
  }

  ensureCanDeliver(order: Order) {
    if (order.status !== OrderStatus.SHIPPED) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'deliver',

        reason: 'Only shipped orders can be delivered',
      });
    }
  }

  ensureCanCancel(order: Order) {
  const cancellableStatuses = [
    OrderStatus.PENDING_PAYMENT,
  ];

  if (!cancellableStatuses.includes(order.status)) {
    throw new InvalidOrderOperationException({
      orderId: order.id,

      operation: 'cancel',

      reason: `Order cannot be cancelled in ${order.status} status`,
    });
  }
}

ensureCanAdminCancel(order: Order) {
  const cancellableStatuses = [
    OrderStatus.PENDING_PAYMENT,
    OrderStatus.CONFIRMED,
    OrderStatus.PROCESSING,
  ];

  if (!cancellableStatuses.includes(order.status)) {
    throw new InvalidOrderOperationException({
      orderId: order.id,
      operation: 'admin_cancel',
      reason: `Order cannot be cancelled in ${order.status} status`,
    });
  }
}

  // =======================
  // 💸 ENSURE REFUNDABLE
  // =======================

  ensureCanRefund(order: Order) {
    // cancelled
    if (order.isCancelled()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'refund',

        reason: 'Cancelled order cannot be refunded',
      });
    }

    // already refunded
    if (order.isRefunded()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'refund',

        reason: 'Order already refunded',
      });
    }

    // payment required
    if (!order.isPaid()) {
      throw new InvalidOrderOperationException({
        orderId: order.id,

        operation: 'refund',

        reason: 'Only paid orders can be refunded',
      });
    }
  }

  // =======================
  // 💰 TOTALS
  // =======================

  calculateSubtotal(items: OrderItem[]): number {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );
  }

  calculateMrpTotal(items: OrderItem[]): number {
    return items.reduce(
      (total, item) => total + (item.mrp ?? item.price) * item.quantity,

      0,
    );
  }

  calculateSavings(items: OrderItem[]): number {
    return this.calculateMrpTotal(items) - this.calculateSubtotal(items);
  }

  calculateGrandTotal(params: {
    subtotal: number;

    shippingCharge?: number;

    tax?: number;

    discount?: number;
  }): number {
    const total =
      params.subtotal + (params.shippingCharge ?? 0) + (params.tax ?? 0) - (params.discount ?? 0);

    return Math.max(total, 0);
  }

  // =======================
  // 📦 ITEMS
  // =======================

  calculateTotalQuantity(items: OrderItem[]): number {
    return items.reduce(
      (total, item) => total + item.quantity,

      0,
    );
  }

  calculateTotalProducts(items: OrderItem[]): number {
    return items.length;
  }

  filterActiveItems(items: OrderItem[]): OrderItem[] {
    return items.filter((item) => !item.isDeleted());
  }

  // =======================
  // 🔐 OWNERSHIP
  // =======================

  belongsToUser(params: {
    order: Order;

    userId: string;
  }): boolean {
    return params.order.userId === params.userId;
  }
}

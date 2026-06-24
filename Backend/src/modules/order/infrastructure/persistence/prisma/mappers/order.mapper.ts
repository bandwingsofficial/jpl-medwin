// src/modules/order/infrastructure/persistence/prisma/mappers/order.mapper.ts

import {
  Order as PrismaOrder,
  OrderStatus as PrismaOrderStatus,
  PaymentStatus as PrismaPaymentStatus,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { Order } from '../../../../domain/entities/order.entity';

import { OrderStatus } from '../../../../domain/enums/order-status.enum';

import { PaymentStatus } from '../../../../domain/enums/payment-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class OrderMapper {
  // =======================
  // 🔄 ORDER STATUS
  // =======================

  private static toDomainOrderStatus(
    status: PrismaOrderStatus,
  ): OrderStatus {
    switch (status) {
      case PrismaOrderStatus.PENDING_PAYMENT:
        return OrderStatus.PENDING_PAYMENT;

      case PrismaOrderStatus.CONFIRMED:
        return OrderStatus.CONFIRMED;

      case PrismaOrderStatus.PROCESSING:
        return OrderStatus.PROCESSING;

      case PrismaOrderStatus.SHIPPED:
        return OrderStatus.SHIPPED;

      case PrismaOrderStatus.DELIVERED:
        return OrderStatus.DELIVERED;

      case PrismaOrderStatus.CANCELLED:
        return OrderStatus.CANCELLED;

      case PrismaOrderStatus.REFUNDED:
        return OrderStatus.REFUNDED;

      case PrismaOrderStatus.RETURNED:
        return OrderStatus.RETURNED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown PrismaOrderStatus', value: status, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaOrderStatus(
    status: OrderStatus,
  ): PrismaOrderStatus {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return PrismaOrderStatus.PENDING_PAYMENT;

      case OrderStatus.CONFIRMED:
        return PrismaOrderStatus.CONFIRMED;

      case OrderStatus.PROCESSING:
        return PrismaOrderStatus.PROCESSING;

      case OrderStatus.SHIPPED:
        return PrismaOrderStatus.SHIPPED;

      case OrderStatus.DELIVERED:
        return PrismaOrderStatus.DELIVERED;

      case OrderStatus.CANCELLED:
        return PrismaOrderStatus.CANCELLED;

      case OrderStatus.REFUNDED:
        return PrismaOrderStatus.REFUNDED;

      case OrderStatus.RETURNED:
        return PrismaOrderStatus.RETURNED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown OrderStatus', value: status, direction: 'prisma_to_domain' });
    }
  }

  // =======================
  // 🔄 PAYMENT STATUS
  // =======================

  private static toDomainPaymentStatus(
    status: PrismaPaymentStatus,
  ): PaymentStatus {
    switch (status) {
      case PrismaPaymentStatus.PENDING:
        return PaymentStatus.PENDING;

      case PrismaPaymentStatus.CREATED:
        return PaymentStatus.CREATED;

      case PrismaPaymentStatus.AUTHORIZED:
        return PaymentStatus.AUTHORIZED;

      case PrismaPaymentStatus.CAPTURED:
        return PaymentStatus.CAPTURED;

      case PrismaPaymentStatus.SUCCESS:
        return PaymentStatus.SUCCESS;

      case PrismaPaymentStatus.FAILED:
        return PaymentStatus.FAILED;

      case PrismaPaymentStatus.CANCELLED:
        return PaymentStatus.CANCELLED;

      case PrismaPaymentStatus.REFUNDED:
        return PaymentStatus.REFUNDED;

      case PrismaPaymentStatus.PARTIALLY_REFUNDED:
        return PaymentStatus.PARTIALLY_REFUNDED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown PrismaPaymentStatus', value: status, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaPaymentStatus(
    status: PaymentStatus,
  ): PrismaPaymentStatus {
    switch (status) {
      case PaymentStatus.PENDING:
        return PrismaPaymentStatus.PENDING;

      case PaymentStatus.CREATED:
        return PrismaPaymentStatus.CREATED;

      case PaymentStatus.AUTHORIZED:
        return PrismaPaymentStatus.AUTHORIZED;

      case PaymentStatus.CAPTURED:
        return PrismaPaymentStatus.CAPTURED;

      case PaymentStatus.SUCCESS:
        return PrismaPaymentStatus.SUCCESS;

      case PaymentStatus.FAILED:
        return PrismaPaymentStatus.FAILED;

      case PaymentStatus.CANCELLED:
        return PrismaPaymentStatus.CANCELLED;

      case PaymentStatus.REFUNDED:
        return PrismaPaymentStatus.REFUNDED;

      case PaymentStatus.PARTIALLY_REFUNDED:
        return PrismaPaymentStatus.PARTIALLY_REFUNDED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown PaymentStatus', value: status, direction: 'prisma_to_domain' });
    }
  }

  // =======================
  // 🧾 TO DOMAIN
  // =======================

  static toDomain(p: PrismaOrder): Order {
  return new Order(
    p.id,

    p.orderNumber,

    p.cartId ?? undefined,

    p.checkoutSessionId ?? undefined,

    p.userId ?? '',

    this.toDomainOrderStatus(p.status),

    this.toDomainPaymentStatus(
      p.paymentStatus,
    ),

    p.couponCode ?? undefined,

    Number(p.subtotal),

    Number(p.couponDiscount),

    Number(p.shippingCharge),

    Number(p.tax),

    Number(p.grandTotal),

    Number(p.totalSavings),

    // =======================
    // 🪙 COINS
    // =======================

    p.earnedCoins,

    p.redeemedCoins,

    Number(p.redeemedAmount),

    (p.shippingAddress as Record<
      string,
      any
    >) ?? {},

    (p.billingAddress as Record<
      string,
      any
    >) ?? {},

    // =======================
    // 🚚 SHIPMENT
    // =======================

    p.trackingId ?? undefined,

    p.courierName ?? undefined,

    p.shippedAt ?? undefined,

    p.deliveredAt ?? undefined,

    p.cancelledAt ?? undefined,

    p.rewardRefunded ?? false,

    p.refundedAt ?? undefined,

    p.customerNote ?? undefined,

    p.adminNote ?? undefined,

    (p.metadata as Record<string, any>) ??
      {},

    p.createdAt,

    p.updatedAt,

    p.deletedAt ?? undefined,
  );
}

  // =======================
  // 💾 TO PERSISTENCE
  // =======================

  static toPersistence(e: Order) {
  return {
    id: e.id,

    orderNumber: e.orderNumber,

    cartId: e.cartId ?? null,

    checkoutSessionId:
      e.checkoutSessionId ?? null,

    userId: e.userId ?? null,

    status: this.toPrismaOrderStatus(
      e.status,
    ),

    paymentStatus:
      this.toPrismaPaymentStatus(
        e.paymentStatus,
      ),

    couponCode: e.couponCode ?? null,

    subtotal: e.subtotal,

    couponDiscount: e.couponDiscount,

    shippingCharge: e.shippingCharge,

    tax: e.tax,

    grandTotal: e.grandTotal,

    totalSavings: e.totalSavings,

    // =======================
    // 🪙 COINS
    // =======================

    earnedCoins: e.earnedCoins,

    redeemedCoins: e.redeemedCoins,

    redeemedAmount: e.redeemedAmount,

    shippingAddress: e.shippingAddress,

    billingAddress: e.billingAddress,

    // =======================
    // 🚚 SHIPMENT
    // =======================

    trackingId: e.trackingId ?? null,

    courierName: e.courierName ?? null,

    shippedAt: e.shippedAt ?? null,

    deliveredAt: e.deliveredAt ?? null,

    cancelledAt: e.cancelledAt ?? null,
    
    rewardRefunded: e.rewardRefunded,
    refundedAt: e.refundedAt ?? null,

    customerNote: e.customerNote ?? null,

    adminNote: e.adminNote ?? null,

    metadata:
  (e.metadata as Prisma.InputJsonValue) ??
  Prisma.JsonNull,

    createdAt: e.createdAt,

    updatedAt: e.updatedAt,

    deletedAt: e.deletedAt ?? null,
  };
}
}
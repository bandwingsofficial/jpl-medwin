import { Injectable } from '@nestjs/common';

import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

import { OrderAddressResponseMapper } from '@/modules/order/application/mappers/order-address-response.mapper';

@Injectable()
export class OrderResponseBuilderService {
  buildReplacementOrder(order: Order | null) {
    if (!order) {
      return null;
    }

    return {
      id: order.id,

      orderNumber: order.orderNumber,

      status: order.status,

      paymentStatus: order.paymentStatus,

      totals: {
        subtotal: order.subtotal,

        couponDiscount: order.couponDiscount,

        shippingCharge: order.shippingCharge,

        tax: order.tax,

        grandTotal: order.grandTotal,

        totalSavings: order.totalSavings,

        redeemedCoins: order.redeemedCoins,

        redeemedAmount: order.redeemedAmount,

        earnedCoins: order.earnedCoins,
      },

      ...OrderAddressResponseMapper.toOrderAddressFields(order),

      shipment: {
        trackingId: order.trackingId,

        courierName: order.courierName,

        shippedAt: order.shippedAt,

        deliveredAt: order.deliveredAt,
      },

      createdAt: order.createdAt,

      updatedAt: order.updatedAt,
    };
  }

  buildPreviewItems(items: OrderItem[]) {
    return items.map((item) => ({
      id: item.id,

      productId: item.productId,

      variantId: item.variantId,

      productName: item.productName,

      variantName: item.variantName,

      imageUrl: item.imageUrl,

      quantity: item.quantity,

      totalPrice: item.totalPrice,
    }));
  }
}

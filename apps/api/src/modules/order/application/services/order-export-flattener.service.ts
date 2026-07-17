// src/modules/order/application/services/order-export-flattener.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderExportFlattenerService {
  flatten(orders: any[]): any[] {
    return orders.map((order) => ({
      // =======================
      // ORDER
      // =======================

      'Order Number': order.orderNumber,

      'Customer Name': order.customerName,

      'Phone Number': order.phoneNumber,

      'Order Status': order.status,

      'Payment Status': order.paymentStatus,

      'Payment Method': order.paymentMethod,

      'Coupon Code': order.couponCode,

      // =======================
      // PRODUCTS
      // =======================

      Products: (order.products ?? []).join('\n'),

      Variants: (order.variants ?? []).join('\n'),

      SKU: (order.skus ?? []).join('\n'),

      Quantity: (order.quantities ?? [])
        .map((q: any) => String(q))
        .join('\n'),

      'Selling Price': (order.sellingPrices ?? [])
        .map((p: any) => String(p))
        .join('\n'),

      MRP: (order.mrps ?? [])
        .map((p: any) => String(p))
        .join('\n'),

      // =======================
      // TOTALS
      // =======================

      Subtotal: order.subtotal ?? 0,

      'Coupon Discount': order.couponDiscount ?? 0,

      'Shipping Charge': order.shippingCharge ?? 0,

      Tax: order.tax ?? 0,

      'Grand Total': order.grandTotal ?? 0,

      'Total Savings': order.totalSavings ?? 0,

      'Redeemed Coins': order.redeemedCoins ?? 0,

      'Redeemed Amount': order.redeemedAmount ?? 0,

      'Earned Coins': order.earnedCoins ?? 0,

      // =======================
      // ADDRESSES
      // =======================

      'Shipping Address': order.shippingAddress ?? '',

      'Billing Address': order.billingAddress ?? '',

      // =======================
      // SHIPMENT
      // =======================

      'Tracking ID': order.trackingId ?? '',

      Courier: order.courierName ?? '',

      // =======================
      // RETURN
      // =======================

      'Return Status': order.returnStatus ?? '',

      'Return Type': order.returnType ?? '',

      'Return Reason': order.returnReason ?? '',

      'Replacement Order': order.replacementOrder ?? '',

      // =======================
      // NOTES
      // =======================

      'Customer Note': order.customerNote ?? '',

      'Admin Note': order.adminNote ?? '',

      // =======================
      // DATES
      // =======================

      'Created At': order.createdAt
        ? new Date(order.createdAt).toISOString()
        : '',

      'Updated At': order.updatedAt
        ? new Date(order.updatedAt).toISOString()
        : '',

      'Shipped At': order.shippedAt
        ? new Date(order.shippedAt).toISOString()
        : '',

      'Delivered At': order.deliveredAt
        ? new Date(order.deliveredAt).toISOString()
        : '',

      'Cancelled At': order.cancelledAt
        ? new Date(order.cancelledAt).toISOString()
        : '',

      'Refunded At': order.refundedAt
        ? new Date(order.refundedAt).toISOString()
        : '',
    }));
  }
}
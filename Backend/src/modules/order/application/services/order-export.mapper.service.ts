import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderExportMapperService {
  map(orders: any[]) {
    // =======================
    // DEBUG (REMOVE AFTER TESTING)
    // =======================
    console.log(
      'Export First Order:',
      JSON.stringify(orders[0], null, 2),
    );

    return orders.map((order) => {
      const latestReturn = order.returns?.[0];

      return {
        // =======================
        // ORDER
        // =======================

        orderId: order.id,

        orderNumber: order.orderNumber,

        userId: order.userId,

        status: order.status,

        paymentStatus: order.paymentStatus,

        paymentMethod: order.paymentMethod ?? '',

        couponCode: order.couponCode ?? '',

        // =======================
        // CUSTOMER
        // =======================

        customerName: order.shippingAddress?.fullName ?? '',

        phoneNumber: order.shippingAddress?.phoneNumber ?? '',

        // =======================
        // PRODUCTS
        // =======================

        products:
          order.items?.map((item: any) => item.productName ?? '') ?? [],

        variants:
          order.items?.map((item: any) => item.variantName ?? '') ?? [],

        skus:
          order.items?.map((item: any) => item.sku ?? '') ?? [],

        quantities:
          order.items?.map((item: any) => item.quantity ?? 0) ?? [],

        sellingPrices:
          order.items?.map((item: any) => item.price ?? 0) ?? [],

        mrps:
          order.items?.map((item: any) => item.mrp ?? item.price ?? 0) ?? [],

        // =======================
        // TOTALS
        // =======================

        subtotal: order.subtotal,

        couponDiscount: order.couponDiscount,

        shippingCharge: order.shippingCharge,

        tax: order.tax,

        grandTotal: order.grandTotal,

        totalSavings: order.totalSavings,

        redeemedCoins: order.redeemedCoins,

        redeemedAmount: order.redeemedAmount,

        earnedCoins: order.earnedCoins,

        // =======================
        // SHIPPING ADDRESS
        // =======================

        shippingAddress: [
          order.shippingAddress?.fullName,
          order.shippingAddress?.phoneNumber,
          order.shippingAddress?.addressLine1,
          order.shippingAddress?.addressLine2,
          order.shippingAddress?.landmark,
          order.shippingAddress?.city,
          order.shippingAddress?.state,
          order.shippingAddress?.country,
          order.shippingAddress?.postalCode,
        ]
          .filter(Boolean)
          .join(', '),

        // =======================
        // BILLING ADDRESS
        // =======================

        billingAddress: [
          order.billingAddress?.fullName,
          order.billingAddress?.phoneNumber,
          order.billingAddress?.addressLine1,
          order.billingAddress?.addressLine2,
          order.billingAddress?.landmark,
          order.billingAddress?.city,
          order.billingAddress?.state,
          order.billingAddress?.country,
          order.billingAddress?.postalCode,
        ]
          .filter(Boolean)
          .join(', '),

        // =======================
        // SHIPMENT
        // =======================

        trackingId: order.trackingId ?? '',

        courierName: order.courierName ?? '',

        shippedAt: order.shippedAt,

        deliveredAt: order.deliveredAt,

        cancelledAt: order.cancelledAt,

        refundedAt: order.refundedAt,

        // =======================
        // NOTES
        // =======================

        customerNote: order.customerNote ?? '',

        adminNote: order.adminNote ?? '',

        // =======================
        // RETURN
        // =======================

        returnId: latestReturn?.id ?? '',

        returnStatus: latestReturn?.status ?? '',

        returnType: latestReturn?.type ?? '',

        returnReason: latestReturn?.reason ?? '',

        replacementOrder: latestReturn?.replacementOrderId ?? '',

        // =======================
        // METADATA
        // =======================

        checkoutSessionId: order.checkoutSessionId ?? '',

        cartId: order.cartId ?? '',

        // =======================
        // DATES
        // =======================

        createdAt: order.createdAt,

        updatedAt: order.updatedAt,
      };
    });
  }
}
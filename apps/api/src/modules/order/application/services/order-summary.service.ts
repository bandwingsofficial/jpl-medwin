// src/modules/order/application/services/order-summary.service.ts

import { Injectable } from '@nestjs/common';

import { OrderItem } from '../../domain/entities/order-item.entity';

@Injectable()
export class OrderSummaryService {
  // =======================
  // 💰 BUILD SUMMARY
  // =======================

  build(params: {
    items: OrderItem[];

    couponDiscount?: number;

    shippingCharge?: number;

    tax?: number;

    rewardDiscount?: number;
  }) {
    const items = this.filterActiveItems(params.items);

    // =======================
    // 💰 SUBTOTAL
    // =======================

    const subtotal = this.calculateSubtotal(items);

    // =======================
    // 💸 MRP TOTAL
    // =======================

    const mrpTotal = this.calculateMrpTotal(items);

    // =======================
    // 🏷 PRODUCT DISCOUNT
    // =======================

    const productDiscount = Math.max(
      mrpTotal - subtotal,

      0,
    );

    // =======================
    // 🎟 COUPON DISCOUNT
    // =======================

    const couponDiscount = params.couponDiscount ?? 0;

    // =======================
    // 🚚 SHIPPING
    // =======================

    const shippingCharge = params.shippingCharge ?? 0;

    // =======================
    // 🧾 TAX
    // =======================

    const tax = params.tax ?? this.calculateTax(subtotal);

    // =======================
    // 🪙 REWARD DISCOUNT
    // =======================

    const rewardDiscount = params.rewardDiscount ?? 0;

    // =======================
    // 💎 TOTAL SAVINGS
    // =======================

    const totalSavings = productDiscount + couponDiscount + rewardDiscount;

    // =======================
    // 💵 GRAND TOTAL
    // =======================

    const grandTotal = Math.max(
      subtotal + shippingCharge + tax - couponDiscount - rewardDiscount,

      0,
    );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      totalProducts: this.calculateTotalProducts(items),

      totalQuantity: this.calculateTotalQuantity(items),

      subtotal,

      mrpTotal,

      productDiscount,

      couponDiscount,

      rewardDiscount,

      totalSavings,

      shipping: shippingCharge,

      tax,

      grandTotal,

      isFreeShipping: shippingCharge === 0,
    };
  }

  // =======================
  // 📦 FILTER ACTIVE ITEMS
  // =======================

  filterActiveItems(items: OrderItem[]): OrderItem[] {
    return items.filter((item) => !item.isDeleted());
  }

  // =======================
  // 💰 SUBTOTAL
  // =======================

  calculateSubtotal(items: OrderItem[]): number {
    return Number(
      items
        .reduce(
          (total, item) => total + item.price * item.quantity,

          0,
        )
        .toFixed(2),
    );
  }

  // =======================
  // 💸 MRP TOTAL
  // =======================

  calculateMrpTotal(items: OrderItem[]): number {
    return Number(
      items
        .reduce(
          (total, item) => total + (item.mrp ?? item.price) * item.quantity,

          0,
        )
        .toFixed(2),
    );
  }

  // =======================
  // 📦 TOTAL QUANTITY
  // =======================

  calculateTotalQuantity(items: OrderItem[]): number {
    return items.reduce(
      (total, item) => total + item.quantity,

      0,
    );
  }

  // =======================
  // 📦 TOTAL PRODUCTS
  // =======================

  calculateTotalProducts(items: OrderItem[]): number {
    return items.length;
  }

  // =======================
  // 🧾 TAX
  // =======================

  calculateTax(subtotal: number): number {
    return Number((subtotal * 0.18).toFixed(2));
  }
}

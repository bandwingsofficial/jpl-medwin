// src/modules/checkout-session/application/services/checkout-session-summary.service.ts

import { Injectable } from '@nestjs/common';

import { CheckoutSessionItem } from '../../domain/entities/checkout-session-item.entity';

@Injectable()
export class CheckoutSessionSummaryService {
  // =======================
  // 💰 BUILD SUMMARY
  // =======================

  build(params: {
    items: CheckoutSessionItem[];

    couponDiscount?: number;

    rewardDiscount?: number;

    shipping?: number;

    tax?: number;
  }) {
    const items = params.items;

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

    const productDiscount = mrpTotal - subtotal;

    // =======================
    // 🎟 COUPON
    // =======================

    const couponDiscount =
      params.couponDiscount ?? 0;

    // =======================
    // 🪙 REWARD DISCOUNT
    // =======================

    const rewardDiscount =
      params.rewardDiscount ?? 0;

    // =======================
    // 🚚 SHIPPING
    // =======================

    const shipping =
      params.shipping ??
      this.calculateShipping(subtotal);

    // =======================
    // 🧾 TAX
    // =======================

    const tax = params.tax ?? 0;

    // =======================
    // 💰 TOTAL SAVINGS
    // =======================

    const totalSavings =
      productDiscount +
      couponDiscount +
      rewardDiscount;

    // =======================
    // 💳 GRAND TOTAL
    // =======================

    const grandTotal = Math.max(
      subtotal +
        shipping +
        tax -
        couponDiscount -
        rewardDiscount,
      0,
    );

    return {
      totalProducts: items.length,

      totalQuantity:
        this.calculateTotalQuantity(items),

      subtotal,

      mrpTotal,

      productDiscount,

      couponDiscount,

      rewardDiscount,

      totalSavings,

      shipping,

      tax,

      grandTotal,

      isFreeShipping: shipping === 0,
    };
  }

  // =======================
  // 📦 ITEM SUMMARY
  // =======================

  buildItemSummary(item: CheckoutSessionItem) {
    const subtotal =
      item.price * item.quantity;

    const mrpTotal =
      (item.mrp ?? item.price) *
      item.quantity;

    const savings =
      mrpTotal - subtotal;

    return {
      quantity: item.quantity,

      subtotal,

      mrpTotal,

      savings,
    };
  }

  // =======================
  // 💰 SUBTOTAL
  // =======================

  calculateSubtotal(
    items: CheckoutSessionItem[],
  ): number {
    return items.reduce(
      (total, item) =>
        total + item.price * item.quantity,

      0,
    );
  }

  // =======================
  // 💸 MRP TOTAL
  // =======================

  calculateMrpTotal(
    items: CheckoutSessionItem[],
  ): number {
    return items.reduce(
      (total, item) =>
        total +
        (item.mrp ?? item.price) *
          item.quantity,

      0,
    );
  }

  // =======================
  // 📦 TOTAL QUANTITY
  // =======================

  calculateTotalQuantity(
    items: CheckoutSessionItem[],
  ): number {
    return items.reduce(
      (total, item) =>
        total + item.quantity,

      0,
    );
  }

  // =======================
  // 🚚 SHIPPING
  // =======================

  calculateShipping(
    subtotal: number,
  ): number {
    // empty
    if (subtotal <= 0) {
      return 0;
    }

    // free shipping
    if (subtotal >= 500) {
      return 0;
    }

    return 50;
  }

  // =======================
  // 🧾 TAX
  // =======================

  calculateTax(
    subtotal: number,
  ): number {
    if (subtotal <= 0) {
      return 0;
    }

    return Number(
      (subtotal * 0.18).toFixed(2),
    );
  }
}
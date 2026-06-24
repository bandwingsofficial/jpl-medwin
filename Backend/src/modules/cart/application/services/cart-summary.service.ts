// src/modules/cart/application/services/cart-summary.service.ts

import { Injectable } from '@nestjs/common';

import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class CartSummaryService {
  // =======================
  // 💰 SUBTOTAL
  // =======================

  calculateSubtotal(items: CartItem[]): number {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );
  }

  // =======================
  // 💸 MRP TOTAL
  // =======================

  calculateMrpTotal(items: CartItem[]): number {
    return items.reduce(
      (total, item) => total + (item.mrp ?? item.price) * item.quantity,

      0,
    );
  }

  // =======================
  // 🏷 PRODUCT DISCOUNT
  // =======================

  calculateProductDiscount(items: CartItem[]): number {
    return this.calculateMrpTotal(items) - this.calculateSubtotal(items);
  }

  // =======================
  // 📦 TOTAL QUANTITY
  // =======================

  calculateTotalQuantity(items: CartItem[]): number {
    return items.reduce(
      (total, item) => total + item.quantity,

      0,
    );
  }

  // =======================
  // 📦 TOTAL PRODUCTS
  // =======================

  calculateTotalProducts(items: CartItem[]): number {
    return items.length;
  }

  // =======================
  // 🚚 SHIPPING
  // =======================

  calculateShipping(subtotal: number): number {
    // empty cart
    if (subtotal <= 0) {
      return 0;
    }

    // free shipping
    if (subtotal >= 500) {
      return 0;
    }

    // standard shipping
    return 50;
  }

  // =======================
  // 🧾 TAX
  // =======================

  // calculateTax(params: {
  //   subtotal: number;

  //   couponDiscount?: number;
  // }): number {
  //   const taxableAmount = params.subtotal - (params.couponDiscount ?? 0);

  //   // no tax
  //   if (taxableAmount <= 0) {
  //     return 0;
  //   }

  //   return Number((taxableAmount * 0.18).toFixed(2));
  // }

  calculateTax(): number {
  return 0;
}

  // =======================
  // 🎟 COUPON DISCOUNT
  // =======================

  calculateCouponDiscount(couponDiscount?: number): number {
    return couponDiscount ?? 0;
  }

  // =======================
  // 💳 GRAND TOTAL
  // =======================

  calculateGrandTotal(params: {
    subtotal: number;

    shipping: number;

    tax: number;

    couponDiscount?: number;
  }): number {
    const total = params.subtotal + params.shipping + params.tax - (params.couponDiscount ?? 0);

    return Number(Math.max(total, 0).toFixed(2));
  }

  // =======================
  // 💵 TOTAL SAVINGS
  // =======================

  calculateSavings(params: {
    productDiscount: number;

    couponDiscount?: number;
  }): number {
    return params.productDiscount + (params.couponDiscount ?? 0);
  }

  // =======================
  // 📦 BUILD SUMMARY
  // =======================

  build(params: {
    items: CartItem[];

    couponDiscount?: number;
  }) {
    const items = params.items;

    // =======================
    // 💰 BASIC TOTALS
    // =======================

    const subtotal = this.calculateSubtotal(items);

    const mrpTotal = this.calculateMrpTotal(items);

    const productDiscount = this.calculateProductDiscount(items);

    // =======================
    // 🎟 COUPON
    // =======================

    const couponDiscount = this.calculateCouponDiscount(params.couponDiscount);

    // =======================
    // 🚚 SHIPPING
    // =======================

    const shipping = this.calculateShipping(subtotal);

    // =======================
    // 🧾 TAX
    // =======================

    // const tax = this.calculateTax({
    //   subtotal,

    //   couponDiscount,
    // });

    const tax = this.calculateTax();

    // =======================
    // 💳 GRAND TOTAL
    // =======================

    const grandTotal = this.calculateGrandTotal({
      subtotal,

      shipping,

      tax,

      couponDiscount,
    });

    // =======================
    // 💵 SAVINGS
    // =======================

    const savings = this.calculateSavings({
      productDiscount,

      couponDiscount,
    });

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

      shipping,

      tax,

      grandTotal,

      savings,
    };
  }

  // =======================
  // 📦 ITEM SUMMARY
  // =======================

  buildItemSummary(item: CartItem) {
    const subtotal = item.price * item.quantity;

    const mrpTotal = (item.mrp ?? item.price) * item.quantity;

    const discount = mrpTotal - subtotal;

    return {
      subtotal,

      mrpTotal,

      discount,
    };
  }
}

// src/modules/checkout-session/domain/services/checkout-session-domain.service.ts

import { Injectable } from '@nestjs/common';

import { CheckoutSession } from '../entities/checkout-session.entity';

import { CheckoutSessionItem } from '../entities/checkout-session-item.entity';

import { InvalidCheckoutSessionException } from '../exceptions/invalid-checkout-session.exception';

@Injectable()
export class CheckoutSessionDomainService {
  // =======================
  // 🛒 SESSION USABILITY
  // =======================

  ensureSessionUsable(session: CheckoutSession) {
    // deleted
    if (session.isDeleted()) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Checkout session is deleted',
      });
    }

    // expired
    if (session.isExpired()) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Checkout session expired',
      });
    }

    // completed
    if (session.isCompleted()) {
      throw new InvalidCheckoutSessionException({
        checkoutSessionId: session.id,

        reason: 'Checkout session already completed',
      });
    }

    session.ensureUsable();
  }

  // =======================
  // 📦 FILTER ACTIVE ITEMS
  // =======================

  filterValidItems(items: CheckoutSessionItem[]): CheckoutSessionItem[] {
    return items.filter((item) => item.quantity > 0);
  }

  // =======================
  // 💰 SUBTOTAL
  // =======================

  calculateSubtotal(items: CheckoutSessionItem[]): number {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,

      0,
    );
  }

  // =======================
  // 💸 MRP TOTAL
  // =======================

  calculateMrpTotal(items: CheckoutSessionItem[]): number {
    return items.reduce(
      (total, item) => total + (item.mrp ?? item.price) * item.quantity,

      0,
    );
  }

  // =======================
  // 🏷 DISCOUNT
  // =======================

  calculateDiscount(items: CheckoutSessionItem[]): number {
    const mrpTotal = this.calculateMrpTotal(items);

    const subtotal = this.calculateSubtotal(items);

    return mrpTotal - subtotal;
  }

  // =======================
  // 🚚 FREE SHIPPING
  // =======================

  isEligibleForFreeShipping(subtotal: number): boolean {
    return subtotal >= 500;
  }

  // =======================
  // 🚚 SHIPPING
  // =======================

  calculateShipping(subtotal: number): number {
    // empty
    if (subtotal <= 0) {
      return 0;
    }

    // free shipping
    if (this.isEligibleForFreeShipping(subtotal)) {
      return 0;
    }

    return 50;
  }

  // =======================
  // 🧾 TAX
  // =======================

  calculateTax(subtotal: number): number {
    // placeholder
    // future GST engine

    return 0;
  }

  // =======================
  // 💳 GRAND TOTAL
  // =======================

  calculateGrandTotal(params: {
  subtotal: number;

  shipping?: number;

  tax?: number;

  couponDiscount?: number;

  rewardDiscount?: number;
}): number {
  const total =
    params.subtotal +
    (params.shipping ?? 0) +
    (params.tax ?? 0) -
    (params.couponDiscount ?? 0) -
    (params.rewardDiscount ?? 0);

  return Math.max(total, 0);
}

  // =======================
  // 💰 TOTAL SAVINGS
  // =======================

  calculateTotalSavings(items: CheckoutSessionItem[]): number {
    return items.reduce(
      (total, item) => total + item.calculateSavings(),

      0,
    );
  }

  // =======================
  // 📦 TOTAL QUANTITY
  // =======================

  calculateTotalQuantity(items: CheckoutSessionItem[]): number {
    return items.reduce(
      (total, item) => total + item.quantity,

      0,
    );
  }

  // =======================
  // 📦 TOTAL PRODUCTS
  // =======================

  calculateTotalProducts(items: CheckoutSessionItem[]): number {
    return items.length;
  }

  // =======================
  // ⏳ EXPIRY
  // =======================

  calculateExpiryDate(minutes: number = 15): Date {
    const now = new Date();

    now.setMinutes(now.getMinutes() + minutes);

    return now;
  }
}

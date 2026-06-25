// src/modules/checkout-session/application/services/checkout-session-summary.service.ts

import { Injectable } from '@nestjs/common';

import { ShippingCalculatorService } from '@/modules/shipping-configuration/application/services/shipping-calculator.service';

import { CheckoutSessionItem } from '../../domain/entities/checkout-session-item.entity';

@Injectable()
export class CheckoutSessionSummaryService {
  constructor(private readonly shippingCalculator: ShippingCalculatorService) {}

  async build(params: {
    items: CheckoutSessionItem[];
    couponDiscount?: number;
    rewardDiscount?: number;
    shipping?: number;
    tax?: number;
  }) {
    const items = params.items;

    const subtotal = this.calculateSubtotal(items);
    const mrpTotal = this.calculateMrpTotal(items);
    const productDiscount = mrpTotal - subtotal;
    const couponDiscount = params.couponDiscount ?? 0;
    const rewardDiscount = params.rewardDiscount ?? 0;

    const shippingResult = await this.shippingCalculator.calculate(subtotal, {
      shipping: params.shipping,
    });

    const tax = params.tax ?? 0;
    const totalSavings = productDiscount + couponDiscount + rewardDiscount;
    const grandTotal = Math.max(
      subtotal + shippingResult.shipping + tax - couponDiscount - rewardDiscount,
      0,
    );

    return {
      totalProducts: items.length,
      totalQuantity: this.calculateTotalQuantity(items),
      subtotal,
      mrpTotal,
      productDiscount,
      couponDiscount,
      rewardDiscount,
      totalSavings,
      shipping: shippingResult.shipping,
      tax,
      grandTotal,
      isFreeShipping: shippingResult.isFreeShipping,
      freeShippingThreshold: shippingResult.freeShippingThreshold,
    };
  }

  buildItemSummary(item: CheckoutSessionItem) {
    const subtotal = item.price * item.quantity;
    const mrpTotal = (item.mrp ?? item.price) * item.quantity;
    const savings = mrpTotal - subtotal;

    return {
      quantity: item.quantity,
      subtotal,
      mrpTotal,
      savings,
    };
  }

  calculateSubtotal(items: CheckoutSessionItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  calculateMrpTotal(items: CheckoutSessionItem[]): number {
    return items.reduce((total, item) => total + (item.mrp ?? item.price) * item.quantity, 0);
  }

  calculateTotalQuantity(items: CheckoutSessionItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  calculateTax(subtotal: number): number {
    if (subtotal <= 0) {
      return 0;
    }

    return Number((subtotal * 0.18).toFixed(2));
  }
}

// src/modules/checkout-session/application/services/checkout-session-summary.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { ShippingCalculatorService } from '@/modules/shipping-configuration/application/services/shipping-calculator.service';
import { TOKENS } from '@/common/constants/tokens';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CheckoutSessionItem } from '../../domain/entities/checkout-session-item.entity';

@Injectable()
export class CheckoutSessionSummaryService {
  constructor(
    private readonly shippingCalculator: ShippingCalculatorService,
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async build(params: {
    items: CheckoutSessionItem[];
    couponDiscount?: number;
    rewardDiscount?: number;
    shipping?: number;
    overweightDeliveryCharge?: number;
    tax?: number;
  }) {
    const items = params.items;

    const subtotal = this.calculateSubtotal(items);
    const mrpTotal = this.calculateMrpTotal(items);
    const productDiscount = mrpTotal - subtotal;
    const couponDiscount = params.couponDiscount ?? 0;
    const rewardDiscount = params.rewardDiscount ?? 0;

    const overweightItems = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepo.findById(item.productId);
        return {
          isOverweight: product?.isOverweight ?? false,
          weightKg: product?.weightKg ?? null,
          quantity: item.quantity,
        };
      }),
    );

    const shippingResult = await this.shippingCalculator.calculate(subtotal, {
      shipping: params.shipping,
      overweightDeliveryCharge: params.overweightDeliveryCharge,
      items: overweightItems,
    });

    const tax = params.tax ?? 0;
    const totalSavings = productDiscount + couponDiscount + rewardDiscount;
    const grandTotal = Math.max(
      subtotal +
        shippingResult.shipping +
        shippingResult.overweightDeliveryCharge +
        tax -
        couponDiscount -
        rewardDiscount,
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
      overweightDeliveryCharge: shippingResult.overweightDeliveryCharge,
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

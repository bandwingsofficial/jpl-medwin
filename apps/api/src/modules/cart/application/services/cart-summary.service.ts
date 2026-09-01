// src/modules/cart/application/services/cart-summary.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { ShippingCalculatorService } from '@/modules/shipping-configuration/application/services/shipping-calculator.service';
import { TOKENS } from '@/common/constants/tokens';
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class CartSummaryService {
  constructor(
    private readonly shippingCalculator: ShippingCalculatorService,
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  calculateSubtotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  calculateMrpTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.mrp ?? item.price) * item.quantity, 0);
  }

  calculateProductDiscount(items: CartItem[]): number {
    return this.calculateMrpTotal(items) - this.calculateSubtotal(items);
  }

  calculateTotalQuantity(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  calculateTotalProducts(items: CartItem[]): number {
    return items.length;
  }

  calculateTax(): number {
    return 0;
  }

  calculateCouponDiscount(couponDiscount?: number): number {
    return couponDiscount ?? 0;
  }

  calculateGrandTotal(params: {
    subtotal: number;
    shipping: number;
    overweightDeliveryCharge?: number;
    tax: number;
    couponDiscount?: number;
  }): number {
    const total =
      params.subtotal +
      params.shipping +
      (params.overweightDeliveryCharge ?? 0) +
      params.tax -
      (params.couponDiscount ?? 0);

    return Number(Math.max(total, 0).toFixed(2));
  }

  calculateSavings(params: { productDiscount: number; couponDiscount?: number }): number {
    return params.productDiscount + (params.couponDiscount ?? 0);
  }

  async build(params: {
    items: CartItem[];
    couponDiscount?: number;
    overweightItems?: Array<{ isOverweight?: boolean; weightKg?: number | null; quantity: number }>;
  }) {
    const items = params.items;

    const subtotal = this.calculateSubtotal(items);
    const mrpTotal = this.calculateMrpTotal(items);
    const productDiscount = this.calculateProductDiscount(items);
    const couponDiscount = this.calculateCouponDiscount(params.couponDiscount);

    let overweightItems = params.overweightItems;
    if (!overweightItems && items.length > 0) {
      overweightItems = await Promise.all(
        items.map(async (item) => {
          const product = await this.productRepo.findById(item.productId);
          return {
            isOverweight: product?.isOverweight ?? false,
            weightKg: product?.weightKg ?? null,
            quantity: item.quantity,
          };
        }),
      );
    }

    const shippingResult = await this.shippingCalculator.calculate(subtotal, {
      items: overweightItems,
    });

    const tax = this.calculateTax();

    const grandTotal = this.calculateGrandTotal({
      subtotal,
      shipping: shippingResult.shipping,
      overweightDeliveryCharge: shippingResult.overweightDeliveryCharge,
      tax,
      couponDiscount,
    });

    const savings = this.calculateSavings({
      productDiscount,
      couponDiscount,
    });

    return {
      totalProducts: this.calculateTotalProducts(items),
      totalQuantity: this.calculateTotalQuantity(items),
      subtotal,
      mrpTotal,
      productDiscount,
      couponDiscount,
      shipping: shippingResult.shipping,
      overweightDeliveryCharge: shippingResult.overweightDeliveryCharge,
      tax,
      grandTotal,
      savings,
      isFreeShipping: shippingResult.isFreeShipping,
      freeShippingThreshold: shippingResult.freeShippingThreshold,
    };
  }

  async buildEmptySummary() {
    const shippingResult = await this.shippingCalculator.calculate(0);

    return {
      totalProducts: 0,
      totalQuantity: 0,
      subtotal: 0,
      mrpTotal: 0,
      productDiscount: 0,
      couponDiscount: 0,
      shipping: shippingResult.shipping,
      overweightDeliveryCharge: 0,
      tax: 0,
      grandTotal: 0,
      savings: 0,
      isFreeShipping: shippingResult.isFreeShipping,
      freeShippingThreshold: shippingResult.freeShippingThreshold,
    };
  }

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

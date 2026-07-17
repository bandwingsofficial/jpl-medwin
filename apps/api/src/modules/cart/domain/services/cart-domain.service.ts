// src/modules/cart/domain/services/cart-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Cart } from '../entities/cart.entity';

import { CartItem } from '../entities/cart-item.entity';

import { CartItemOutOfStockException } from '../exceptions/cart-item-out-of-stock.exception';

import { CartLockedException } from '../exceptions/cart-locked.exception';

@Injectable()
export class CartDomainService {
  // =======================
  // 🛒 CART USABILITY
  // =======================

  ensureCartUsable(cart: Cart) {
    // deleted
    if (cart.isDeleted()) {
      throw new Error('Cart is deleted');
    }

    // expired
    if (cart.isExpired()) {
      throw new Error('Cart has expired');
    }

    // locked
    if (cart.isLocked()) {
      throw new CartLockedException({
        cartId: cart.id,
      });
    }

    cart.ensureUsable();
  }

  // =======================
  // 📦 STOCK VALIDATION
  // =======================

  validateStock(params: {
    requestedQuantity: number;

    availableQuantity: number;

    variantId: string;
  }) {
    const {
      requestedQuantity,

      availableQuantity,

      variantId,
    } = params;

    // invalid quantity
    if (requestedQuantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    // out of stock
    if (requestedQuantity > availableQuantity) {
      throw new CartItemOutOfStockException({
        variantId,

        requestedQuantity,

        availableQuantity,
      });
    }
  }

  // =======================
  // 🔄 MERGE QUANTITY
  // =======================

  mergeQuantities(params: {
    existingQuantity: number;

    incomingQuantity: number;

    availableQuantity: number;

    variantId: string;
  }): number {
    const finalQuantity = params.existingQuantity + params.incomingQuantity;

    this.validateStock({
      requestedQuantity: finalQuantity,

      availableQuantity: params.availableQuantity,

      variantId: params.variantId,
    });

    return finalQuantity;
  }

  // =======================
  // 📊 SUBTOTAL
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
  // 🏷 DISCOUNT
  // =======================

  calculateDiscount(items: CartItem[]): number {
    const mrpTotal = this.calculateMrpTotal(items);

    const subtotal = this.calculateSubtotal(items);

    return mrpTotal - subtotal;
  }

  // =======================
  // 💳 GRAND TOTAL
  // =======================

  calculateGrandTotal(params: {
    subtotal: number;

    shipping?: number;

    tax?: number;

    couponDiscount?: number;
  }): number {
    const total =
      params.subtotal + (params.shipping ?? 0) + (params.tax ?? 0) - (params.couponDiscount ?? 0);

    return Math.max(total, 0);
  }

  // =======================
  // 🧹 FILTER ACTIVE ITEMS
  // =======================

  filterActiveItems(items: CartItem[]): CartItem[] {
    return items.filter((item) => !item.isDeleted());
  }

  // =======================
  // 🔐 USER OWNERSHIP
  // =======================

  belongsToUser(params: {
    cart: Cart;

    userId: string;
  }): boolean {
    return params.cart.userId === params.userId;
  }

  // =======================
  // 👥 GUEST OWNERSHIP
  // =======================

  belongsToGuest(params: {
    cart: Cart;

    guestId: string;
  }): boolean {
    return params.cart.guestId === params.guestId;
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
}

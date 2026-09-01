// src/modules/cart/domain/entities/cart-item.entity.ts

import { CartItemOutOfStockException } from '../exceptions/cart-item-out-of-stock.exception';

export class CartItem {
  constructor(
    public readonly id: string,

    public cartId: string,

    public productId: string,

    public variantId: string,

    public quantity: number,

    // =======================
    // 📸 SNAPSHOTS
    // =======================

    public productName: string,

    public variantName?: string,

    public sku?: string,

    public imageUrl?: string,

    // =======================
    // 💰 PRICE
    // =======================

    public price: number = 0,

    public mrp?: number,

    // =======================
    // 🕒 TIMESTAMPS
    // =======================

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),

    // =======================
    // ♻️ DELETE
    // =======================

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  increaseQuantity(qty: number = 1) {
    this.quantity += qty;

    this.touch();
  }

  decreaseQuantity(qty: number = 1) {
    this.quantity -= qty;

    if (this.quantity < 1) {
      this.quantity = 1;
    }

    this.touch();
  }

  setQuantity(quantity: number) {
    if (quantity < 1) {
      quantity = 1;
    }

    this.quantity = quantity;

    this.touch();
  }

  ensureStock(availableQuantity: number) {
    if (this.quantity > availableQuantity) {
      throw new CartItemOutOfStockException({
        variantId: this.variantId,

        requestedQuantity: this.quantity,

        availableQuantity,
      });
    }
  }

  softDelete() {
    if (this.isDeleted()) {
      return;
    }

    this.deletedAt = new Date();

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.touch();
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}

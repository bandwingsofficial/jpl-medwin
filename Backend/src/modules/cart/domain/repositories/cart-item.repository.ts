// src/modules/cart/domain/repositories/cart-item.repository.ts

import { CartItem } from '../entities/cart-item.entity';

export interface CartItemRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<CartItem | null>;

  findByCartId(cartId: string): Promise<CartItem[]>;

  findByVariantId(params: {
    cartId: string;

    variantId: string;
  }): Promise<CartItem | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsByVariantId(params: {
    cartId: string;

    variantId: string;
  }): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(item: CartItem): Promise<CartItem>;

  update(item: CartItem): Promise<CartItem>;

  createMany(items: CartItem[]): Promise<void>;

  updateMany(items: CartItem[]): Promise<void>;

  // =======================
  // 🔄 QUANTITY
  // =======================

  increaseQuantity(params: {
    itemId: string;

    quantity?: number;
  }): Promise<void>;

  decreaseQuantity(params: {
    itemId: string;

    quantity?: number;
  }): Promise<void>;

  setQuantity(params: {
    itemId: string;

    quantity: number;
  }): Promise<void>;

  // =======================
  // 🧹 CLEAR
  // =======================

  clearCart(cartId: string): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(itemId: string): Promise<void>;

  restore(itemId: string): Promise<void>;

  delete(itemId: string): Promise<void>;

  // =======================
// ❌ DELETE BY RELATION
// =======================

deleteByVariantId(variantId: string): Promise<void>;

deleteByProductId(productId: string): Promise<void>;
}

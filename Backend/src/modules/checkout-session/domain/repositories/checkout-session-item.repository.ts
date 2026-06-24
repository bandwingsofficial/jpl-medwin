// src/modules/checkout-session/domain/repositories/checkout-session-item.repository.ts

import { CheckoutSessionItem } from '../entities/checkout-session-item.entity';

export interface CheckoutSessionItemRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<CheckoutSessionItem | null>;

  findByCheckoutSessionId(checkoutSessionId: string): Promise<CheckoutSessionItem[]>;

  findByVariantId(params: {
    checkoutSessionId: string;

    variantId: string;
  }): Promise<CheckoutSessionItem | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsByVariantId(params: {
    checkoutSessionId: string;

    variantId: string;
  }): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(item: CheckoutSessionItem): Promise<CheckoutSessionItem>;

  createMany(items: CheckoutSessionItem[]): Promise<void>;

  update(item: CheckoutSessionItem): Promise<CheckoutSessionItem>;

  updateMany(items: CheckoutSessionItem[]): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  delete(itemId: string): Promise<void>;
}

// src/modules/cart/application/services/cart-merge.service.ts

import { Injectable } from '@nestjs/common';

import { CartItem } from '../../domain/entities/cart-item.entity';

@Injectable()
export class CartMergeService {
  // =======================
  // 🔄 MERGE ITEMS
  // =======================

  mergeItems(params: {
    sourceItems: CartItem[];

    targetItems: CartItem[];

    stockMap?: Map<string, number>;
  }): CartItem[] {
    const map = new Map<string, CartItem>();

    // =======================
    // 🎯 TARGET ITEMS
    // =======================

    for (const item of params.targetItems) {
      map.set(
        item.variantId,

        item,
      );
    }

    // =======================
    // 🔄 SOURCE ITEMS
    // =======================

    for (const sourceItem of params.sourceItems) {
      const existing = map.get(sourceItem.variantId);

      // =======================
      // ➕ MERGE QUANTITY
      // =======================

      if (existing) {
        const mergedQuantity = existing.quantity + sourceItem.quantity;

        // optional stock validation
        const availableStock = params.stockMap?.get(sourceItem.variantId);

        existing.setQuantity(
          availableStock ? Math.min(mergedQuantity, availableStock) : mergedQuantity,
        );
      }

      // =======================
      // 🆕 NEW ITEM
      // =======================
      else {
        const cloned = new CartItem(
          sourceItem.id,

          sourceItem.cartId,

          sourceItem.productId,

          sourceItem.variantId,

          sourceItem.quantity,

          sourceItem.productName,

          sourceItem.variantName,

          sourceItem.sku,

          sourceItem.imageUrl,

          sourceItem.price,

          sourceItem.mrp,
        );

        map.set(
          cloned.variantId,

          cloned,
        );
      }
    }

    return Array.from(map.values());
  }
}

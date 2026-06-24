// src/modules/checkout-session/infrastructure/persistence/prisma/mappers/checkout-session-item.mapper.ts

import { CheckoutSessionItem as PrismaCheckoutSessionItem } from '@prisma/client';

import { CheckoutSessionItem } from '../../../../domain/entities/checkout-session-item.entity';

export class CheckoutSessionItemMapper {
  // =======================
  // 🔄 TO DOMAIN
  // =======================

  static toDomain(p: PrismaCheckoutSessionItem): CheckoutSessionItem {
    return new CheckoutSessionItem(
      p.id,

      p.checkoutSessionId,

      p.productId,

      p.variantId,

      p.quantity,

      p.productName,

      p.variantName ?? undefined,

      p.sku ?? undefined,

      p.imageUrl ?? undefined,

      Number(p.price),

      p.mrp ? Number(p.mrp) : undefined,

      Number(p.totalPrice),

      p.createdAt,

      p.updatedAt,
    );
  }

  // =======================
  // 🔄 TO PERSISTENCE
  // =======================

  static toPersistence(e: CheckoutSessionItem) {
    return {
      id: e.id,

      checkoutSessionId: e.checkoutSessionId,

      productId: e.productId,

      variantId: e.variantId,

      quantity: e.quantity,

      productName: e.productName,

      variantName: e.variantName ?? null,

      sku: e.sku ?? null,

      imageUrl: e.imageUrl ?? null,

      price: e.price,

      mrp: e.mrp ?? null,

      totalPrice: e.totalPrice,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,
    };
  }
}

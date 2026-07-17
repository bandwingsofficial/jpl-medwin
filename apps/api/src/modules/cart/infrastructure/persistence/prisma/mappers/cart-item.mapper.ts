// src/modules/cart/infrastructure/persistence/prisma/mappers/cart-item.mapper.ts

import { CartItem as PrismaCartItem } from '@prisma/client';

import { CartItem } from '../../../../domain/entities/cart-item.entity';

export class CartItemMapper {
  // =======================
  // 📦 ITEM
  // =======================

  static toDomain(p: PrismaCartItem): CartItem {
    return new CartItem(
      p.id,

      p.cartId,

      p.productId,

      p.variantId,

      p.quantity,

      p.productName,

      p.variantName ?? undefined,

      p.sku ?? undefined,

      p.imageUrl ?? undefined,

      Number(p.price),

      p.mrp ? Number(p.mrp) : undefined,

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: CartItem) {
    return {
      id: e.id,

      cartId: e.cartId,

      productId: e.productId,

      variantId: e.variantId,

      quantity: e.quantity,

      productName: e.productName,

      variantName: e.variantName ?? null,

      sku: e.sku ?? null,

      imageUrl: e.imageUrl ?? null,

      price: e.price,

      mrp: e.mrp ?? null,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}

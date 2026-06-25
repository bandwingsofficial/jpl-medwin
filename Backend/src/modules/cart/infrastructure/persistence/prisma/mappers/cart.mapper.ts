// src/modules/cart/infrastructure/persistence/prisma/mappers/cart.mapper.ts

import { Cart as PrismaCart, CartStatus as PrismaCartStatus } from '@prisma/client';

import { Cart } from '../../../../domain/entities/cart.entity';

import { CartStatus } from '../../../../domain/enums/cart-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CartMapper {
  // =======================
  // 🔄 ENUM
  // =======================

  private static toDomainStatus(status: PrismaCartStatus): CartStatus {
    switch (status) {
      case PrismaCartStatus.ACTIVE:
        return CartStatus.ACTIVE;

      case PrismaCartStatus.LOCKED:
        return CartStatus.LOCKED;

      case PrismaCartStatus.CONVERTED:
        return CartStatus.CONVERTED;

      case PrismaCartStatus.ABANDONED:
        return CartStatus.ABANDONED;

      case PrismaCartStatus.EXPIRED:
        return CartStatus.EXPIRED;

      case PrismaCartStatus.MERGED:
        return CartStatus.MERGED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown PrismaCartStatus',
          value: status,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaStatus(status: CartStatus): PrismaCartStatus {
    switch (status) {
      case CartStatus.ACTIVE:
        return PrismaCartStatus.ACTIVE;

      case CartStatus.LOCKED:
        return PrismaCartStatus.LOCKED;

      case CartStatus.CONVERTED:
        return PrismaCartStatus.CONVERTED;

      case CartStatus.ABANDONED:
        return PrismaCartStatus.ABANDONED;

      case CartStatus.EXPIRED:
        return PrismaCartStatus.EXPIRED;

      case CartStatus.MERGED:
        return PrismaCartStatus.MERGED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown CartStatus',
          value: status,
          direction: 'prisma_to_domain',
        });
    }
  }

  // =======================
  // 🛒 CART
  // =======================

  static toDomain(p: PrismaCart): Cart {
    return new Cart(
      p.id,

      // =======================
      // 👤 OWNERSHIP
      // =======================

      p.userId ?? undefined,

      p.guestId ?? undefined,

      // =======================
      // 📦 STATUS
      // =======================

      this.toDomainStatus(p.status),

      // =======================
      // 🎟 COUPON
      // =======================

      p.couponId ?? undefined,

      p.couponCode ?? undefined,

      p.couponDiscount ? Number(p.couponDiscount) : undefined,

      // =======================
      // 🔒 LOCK
      // =======================

      p.lockedAt ?? undefined,

      // =======================
      // 🔄 MERGE
      // =======================

      p.mergedIntoCartId ?? undefined,

      // =======================
      // ⏳ EXPIRY
      // =======================

      p.expiresAt ?? undefined,

      // =======================
      // 🕒 TIMESTAMPS
      // =======================

      p.createdAt,

      p.updatedAt,

      // =======================
      // ♻️ DELETE
      // =======================

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: Cart) {
    return {
      id: e.id,

      // =======================
      // 👤 OWNERSHIP
      // =======================

      userId: e.userId ?? null,

      guestId: e.guestId ?? null,

      // =======================
      // 📦 STATUS
      // =======================

      status: this.toPrismaStatus(e.status),

      // =======================
      // 🎟 COUPON
      // =======================

      couponId: e.couponId ?? null,

      couponCode: e.couponCode ?? null,

      couponDiscount: e.couponDiscount ?? null,

      // =======================
      // 🔒 LOCK
      // =======================

      lockedAt: e.lockedAt ?? null,

      // =======================
      // 🔄 MERGE
      // =======================

      mergedIntoCartId: e.mergedIntoCartId ?? null,

      // =======================
      // ⏳ EXPIRY
      // =======================

      expiresAt: e.expiresAt ?? null,

      // =======================
      // 🕒 TIMESTAMPS
      // =======================

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      // =======================
      // ♻️ DELETE
      // =======================

      deletedAt: e.deletedAt ?? null,
    };
  }
}

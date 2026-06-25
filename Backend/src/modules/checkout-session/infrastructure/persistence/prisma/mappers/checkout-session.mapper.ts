// src/modules/checkout-session/infrastructure/persistence/prisma/mappers/checkout-session.mapper.ts

import {
  CheckoutSession as PrismaCheckoutSession,
  CheckoutSessionStatus as PrismaCheckoutSessionStatus,
} from '@prisma/client';
import { Prisma } from '@prisma/client';
import { CheckoutSession } from '../../../../domain/entities/checkout-session.entity';

import { CheckoutSessionStatus } from '../../../../domain/enums/checkout-session-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CheckoutSessionMapper {
  // =======================
  // 🔄 ENUM
  // =======================

  private static toDomainStatus(status: PrismaCheckoutSessionStatus): CheckoutSessionStatus {
    switch (status) {
      case PrismaCheckoutSessionStatus.ACTIVE:
        return CheckoutSessionStatus.ACTIVE;

      case PrismaCheckoutSessionStatus.COMPLETED:
        return CheckoutSessionStatus.COMPLETED;

      case PrismaCheckoutSessionStatus.FAILED:
        return CheckoutSessionStatus.FAILED;

      case PrismaCheckoutSessionStatus.EXPIRED:
        return CheckoutSessionStatus.EXPIRED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown PrismaCheckoutSessionStatus',
          value: status,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaStatus(status: CheckoutSessionStatus): PrismaCheckoutSessionStatus {
    switch (status) {
      case CheckoutSessionStatus.ACTIVE:
        return PrismaCheckoutSessionStatus.ACTIVE;

      case CheckoutSessionStatus.COMPLETED:
        return PrismaCheckoutSessionStatus.COMPLETED;

      case CheckoutSessionStatus.FAILED:
        return PrismaCheckoutSessionStatus.FAILED;

      case CheckoutSessionStatus.EXPIRED:
        return PrismaCheckoutSessionStatus.EXPIRED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown CheckoutSessionStatus',
          value: status,
          direction: 'prisma_to_domain',
        });
    }
  }

  // =======================
  // 🔄 TO DOMAIN
  // =======================

  static toDomain(p: PrismaCheckoutSession): CheckoutSession {
    return new CheckoutSession(
      p.id,

      p.cartId,

      p.userId ?? undefined,

      p.guestId ?? undefined,

      this.toDomainStatus(p.status),

      p.couponCode ?? undefined,

      Number(p.subtotal),

      Number(p.couponDiscount),

      Number(p.rewardCoinsUsed),

      Number(p.rewardDiscount),

      Number(p.shippingCharge),

      Number(p.tax),

      Number(p.grandTotal),

      Number(p.totalSavings),

      p.expiresAt,

      (p.metadata as Record<string, unknown>) || {},

      p.completedAt ?? undefined,

      p.failedAt ?? undefined,

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  // =======================
  // 🔄 TO PERSISTENCE
  // =======================

  static toPersistence(e: CheckoutSession) {
    return {
      id: e.id,

      cartId: e.cartId,

      userId: e.userId ?? null,

      guestId: e.guestId ?? null,

      status: this.toPrismaStatus(e.status),

      couponCode: e.couponCode ?? null,

      subtotal: e.subtotal,

      couponDiscount: e.couponDiscount,

      rewardCoinsUsed: e.rewardCoinsUsed,

      rewardDiscount: e.rewardDiscount,

      shippingCharge: e.shippingCharge,

      tax: e.tax,

      grandTotal: e.grandTotal,

      totalSavings: e.totalSavings,

      metadata: (e.metadata as Prisma.InputJsonValue) ?? Prisma.JsonNull,

      expiresAt: e.expiresAt,

      completedAt: e.completedAt ?? null,

      failedAt: e.failedAt ?? null,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}

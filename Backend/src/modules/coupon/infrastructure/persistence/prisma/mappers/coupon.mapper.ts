// src/modules/coupon/infrastructure/persistence/prisma/mappers/coupon.mapper.ts

import {
  Coupon as PrismaCoupon,
  CouponStatus as PrismaCouponStatus,
  CouponDiscountType as PrismaCouponDiscountType,
} from '@prisma/client';

import { Coupon } from '../../../../domain/entities/coupon.entity';

import { CouponStatus } from '../../../../domain/enums/coupon-status.enum';

import { CouponDiscountType } from '../../../../domain/enums/coupon-discount-type.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CouponMapper {
  // =======================
  // 🔄 ENUM MAPPING
  // =======================

  private static toDomainStatus(status: PrismaCouponStatus): CouponStatus {
    switch (status) {
      case PrismaCouponStatus.ACTIVE:
        return CouponStatus.ACTIVE;

      case PrismaCouponStatus.INACTIVE:
        return CouponStatus.INACTIVE;

      case PrismaCouponStatus.EXPIRED:
        return CouponStatus.EXPIRED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Prisma coupon status',
          value: status,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaStatus(status: CouponStatus): PrismaCouponStatus {
    switch (status) {
      case CouponStatus.ACTIVE:
        return PrismaCouponStatus.ACTIVE;

      case CouponStatus.INACTIVE:
        return PrismaCouponStatus.INACTIVE;

      case CouponStatus.EXPIRED:
        return PrismaCouponStatus.EXPIRED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Domain coupon status',
          value: status,
          direction: 'domain_to_prisma',
        });
    }
  }

  private static toDomainDiscountType(type: PrismaCouponDiscountType): CouponDiscountType {
    switch (type) {
      case PrismaCouponDiscountType.PERCENTAGE:
        return CouponDiscountType.PERCENTAGE;

      case PrismaCouponDiscountType.FIXED:
        return CouponDiscountType.FIXED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Prisma coupon discount type',
          value: type,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaDiscountType(type: CouponDiscountType): PrismaCouponDiscountType {
    switch (type) {
      case CouponDiscountType.PERCENTAGE:
        return PrismaCouponDiscountType.PERCENTAGE;

      case CouponDiscountType.FIXED:
        return PrismaCouponDiscountType.FIXED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Domain coupon discount type',
          value: type,
          direction: 'domain_to_prisma',
        });
    }
  }

  // =======================
  // 🎟 COUPON
  // =======================

  static toDomain(p: PrismaCoupon): Coupon {
    return new Coupon(
      p.id,

      // =======================
      // 🎟 BASIC
      // =======================

      p.code,

      this.toDomainDiscountType(p.discountType),

      Number(p.discountValue),

      // =======================
      // 💰 LIMITS
      // =======================

      p.minimumOrderAmount ? Number(p.minimumOrderAmount) : undefined,

      p.maximumDiscountAmount ? Number(p.maximumDiscountAmount) : undefined,

      p.usageLimit ?? undefined,

      p.usedCount,

      p.perUserLimit ?? undefined,

      // =======================
      // 🚦 STATUS
      // =======================

      this.toDomainStatus(p.status),

      p.isPublic,

      // =======================
      // ⏰ VALIDITY
      // =======================

      p.startsAt ?? undefined,

      p.expiresAt ?? undefined,

      // =======================
      // 🕒 SYSTEM
      // =======================

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: Coupon) {
    return {
      id: e.id,

      // =======================
      // 🎟 BASIC
      // =======================

      code: e.code,

      discountType: this.toPrismaDiscountType(e.discountType),

      discountValue: e.discountValue,

      // =======================
      // 💰 LIMITS
      // =======================

      minimumOrderAmount: e.minimumOrderAmount ?? null,

      maximumDiscountAmount: e.maximumDiscountAmount ?? null,

      usageLimit: e.usageLimit ?? null,

      usedCount: e.usedCount,

      perUserLimit: e.perUserLimit ?? null,

      // =======================
      // 🚦 STATUS
      // =======================

      status: this.toPrismaStatus(e.status),

      isPublic: e.isPublic,

      // =======================
      // ⏰ VALIDITY
      // =======================

      startsAt: e.startsAt ?? null,

      expiresAt: e.expiresAt ?? null,

      // =======================
      // 🕒 SYSTEM
      // =======================

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}

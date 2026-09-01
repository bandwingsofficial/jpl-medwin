// src/modules/coupon/infrastructure/persistence/prisma/repositories/prisma-coupon.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CouponRepository } from '../../../../domain/repositories/coupon.repository';

import { Coupon } from '../../../../domain/entities/coupon.entity';

import { CouponStatus } from '../../../../domain/enums/coupon-status.enum';

import { CouponMapper } from '../mappers/coupon.mapper';

@Injectable()
export class PrismaCouponRepository implements CouponRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Coupon | null> {
    const data = await this.prisma.coupon.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });

    return data ? CouponMapper.toDomain(data) : null;
  }

  async findByIdIncludingDeleted(id: string): Promise<Coupon | null> {
    const data = await this.prisma.coupon.findFirst({
      where: { id },
    });

    return data ? CouponMapper.toDomain(data) : null;
  }

  async findByCode(code: string): Promise<Coupon | null> {
    const data = await this.prisma.coupon.findFirst({
      where: {
        code,
        deletedAt: null,
      },
    });

    return data ? CouponMapper.toDomain(data) : null;
  }

  async findByCodeIncludingDeleted(code: string): Promise<Coupon | null> {
    const data = await this.prisma.coupon.findFirst({
      where: {
        code,
      },
    });

    return data ? CouponMapper.toDomain(data) : null;
  }

  async findAll(): Promise<Coupon[]> {
    const data = await this.prisma.coupon.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CouponMapper.toDomain(c));
  }

  async findAllIncludingDeleted(): Promise<Coupon[]> {
    const data = await this.prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CouponMapper.toDomain(c));
  }

  async findByStatus(status: CouponStatus): Promise<Coupon[]> {
    const data = await this.prisma.coupon.findMany({
      where: {
        status,
        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CouponMapper.toDomain(c));
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    const data = await this.prisma.coupon.findMany({
      where: {
        status: CouponStatus.ACTIVE,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CouponMapper.toDomain(c));
  }

  async findExpiredCoupons(): Promise<Coupon[]> {
    const data = await this.prisma.coupon.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((c) => CouponMapper.toDomain(c));
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.coupon.count({
      where: {
        id,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsByCode(code: string): Promise<boolean> {
    const count = await this.prisma.coupon.count({
      where: {
        code,
        deletedAt: null,
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(coupon: Coupon): Promise<Coupon> {
    const data = await this.prisma.coupon.create({
      data: CouponMapper.toPersistence(coupon),
    });

    return CouponMapper.toDomain(data);
  }

  async update(coupon: Coupon): Promise<Coupon> {
    const data = await this.prisma.coupon.update({
      where: {
        id: coupon.id,
      },

      data: CouponMapper.toPersistence(coupon),
    });

    return CouponMapper.toDomain(data);
  }

  // =======================
  // 📊 USAGE
  // =======================

  async incrementUsage(couponId: string): Promise<void> {
    await this.prisma.coupon.update({
      where: {
        id: couponId,
      },

      data: {
        usedCount: {
          increment: 1,
        },
      },
    });
  }

  // =======================
  // 👤 USER USAGE COUNT
  // =======================

  async countUserCouponUsage(params: {
    couponId: string;

    userId: string;
  }): Promise<number> {
    const { couponId, userId } = params;

    return this.prisma.couponRedemption.count({
      where: {
        couponId,

        userId,
      },
    });
  }

  // =======================
  // 🚫 DUPLICATE ORDER CHECK
  // =======================

  async hasUserUsedCouponForOrder(params: {
    couponId: string;

    userId: string;

    orderId: string;
  }): Promise<boolean> {
    const { couponId, userId, orderId } = params;

    const count = await this.prisma.couponRedemption.count({
      where: {
        couponId,

        userId,

        orderId,
      },
    });

    return count > 0;
  }

  // =======================
  // 🎟 REDEEM COUPON
  // =======================

  async redeemCoupon(params: {
    couponId: string;

    userId: string;

    orderId: string;

    discountAmount: number;
  }): Promise<void> {
    const { couponId, userId, orderId, discountAmount } = params;

    await this.prisma.$transaction(async (tx) => {
      // =======================
      // 🚫 DUPLICATE CHECK
      // =======================

      const existing = await tx.couponRedemption.findFirst({
        where: {
          couponId,

          userId,

          orderId,
        },
      });

      if (existing) {
        return;
      }

      // =======================
      // 📊 CREATE REDEMPTION
      // =======================

      await tx.couponRedemption.create({
        data: {
          couponId,

          userId,

          orderId,

          discountAmount,
        },
      });

      // =======================
      // 📈 INCREMENT USAGE
      // =======================

      await tx.coupon.update({
        where: {
          id: couponId,
        },

        data: {
          usedCount: {
            increment: 1,
          },
        },
      });
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(id: string): Promise<void> {
    await this.prisma.coupon.update({
      where: { id },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  // =======================
  // ♻️ RESTORE
  // =======================

  async restore(id: string): Promise<void> {
    await this.prisma.coupon.update({
      where: { id },

      data: {
        deletedAt: null,
      },
    });
  }
}

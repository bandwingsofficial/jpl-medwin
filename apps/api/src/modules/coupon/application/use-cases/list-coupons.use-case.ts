// src/modules/coupon/application/use-cases/list-coupons.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { Coupon } from '../../domain/entities/coupon.entity';
import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponStatus } from '../../domain/enums/coupon-status.enum';

@Injectable()
export class ListCouponsUseCase {
  constructor(
    @Inject(TOKENS.COUPON_REPO)
    private readonly couponRepo: CouponRepository,
  ) {}

  async execute(input?: {
    status?: CouponStatus;

    includeDeleted?: boolean;
  }) {
    let coupons: Coupon[] = [];

    // =======================
    // ♻️ INCLUDE DELETED
    // =======================

    if (input?.includeDeleted) {
      coupons = await this.couponRepo.findAllIncludingDeleted();
    }

    // =======================
    // 🚦 FILTER BY STATUS
    // =======================
    else if (input?.status) {
      coupons = await this.couponRepo.findByStatus(input.status);
    }

    // =======================
    // 📋 ALL ACTIVE
    // =======================
    else {
      coupons = await this.couponRepo.findAll();
    }

    // =======================
    // 🚀 RESPONSE
    // =======================

    return coupons.map((coupon) => ({
      id: coupon.id,

      code: coupon.code,

      discountType: coupon.discountType,

      discountValue: coupon.discountValue,

      minimumOrderAmount: coupon.minimumOrderAmount,

      maximumDiscountAmount: coupon.maximumDiscountAmount,

      usageLimit: coupon.usageLimit,

      usedCount: coupon.usedCount,

      perUserLimit: coupon.perUserLimit,

      status: coupon.status,

      isPublic: coupon.isPublic,

      startsAt: coupon.startsAt,

      expiresAt: coupon.expiresAt,

      createdAt: coupon.createdAt,

      updatedAt: coupon.updatedAt,

      deletedAt: coupon.deletedAt,
    }));
  }
}

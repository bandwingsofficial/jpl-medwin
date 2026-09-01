// src/modules/coupon/application/use-cases/get-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponNotFoundException } from '../../domain/exceptions/coupon-not-found.exception';

@Injectable()
export class GetCouponUseCase {
  constructor(
    @Inject(TOKENS.COUPON_REPO)
    private readonly couponRepo: CouponRepository,
  ) {}

  async execute(input: { couponId: string }) {
    // =======================
    // 🔍 FIND COUPON
    // =======================

    const coupon = await this.couponRepo.findById(input.couponId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!coupon) {
      throw new CouponNotFoundException({
        couponId: input.couponId,
      });
    }

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
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
    };
  }
}

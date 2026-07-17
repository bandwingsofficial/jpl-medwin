// src/modules/coupon/application/use-cases/delete-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponNotFoundException } from '../../domain/exceptions/coupon-not-found.exception';

@Injectable()
export class DeleteCouponUseCase {
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
    // ❌ SOFT DELETE
    // =======================

    coupon.softDelete();

    // =======================
    // 💾 SAVE
    // =======================

    const deleted = await this.couponRepo.update(coupon);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: deleted.id,

      code: deleted.code,

      deletedAt: deleted.deletedAt,

      updatedAt: deleted.updatedAt,
    };
  }
}

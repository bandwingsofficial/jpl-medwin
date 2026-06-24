// src/modules/coupon/application/use-cases/deactivate-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponNotFoundException } from '../../domain/exceptions/coupon-not-found.exception';

@Injectable()
export class DeactivateCouponUseCase {
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
    // 🚫 DEACTIVATE
    // =======================

    coupon.deactivate();

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.couponRepo.update(coupon);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      code: updated.code,

      status: updated.status,

      updatedAt: updated.updatedAt,
    };
  }
}

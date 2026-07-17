// src/modules/coupon/application/use-cases/activate-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponNotFoundException } from '../../domain/exceptions/coupon-not-found.exception';

@Injectable()
export class ActivateCouponUseCase {
  constructor(
    @Inject(TOKENS.COUPON_REPO)
    private readonly couponRepo: CouponRepository,
  ) {}

  async execute(input: { couponId: string }) {
    // =======================
    // 🔍 FIND COUPON
    // =======================

    const coupon = await this.couponRepo.findByIdIncludingDeleted(input.couponId);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!coupon) {
      throw new CouponNotFoundException({
        couponId: input.couponId,
      });
    }

    // =======================
    // 🛡 RESTORE IF DELETED
    // =======================

    if (coupon.deletedAt) {
      coupon.restore();
    }

    // =======================
    // ✅ ACTIVATE
    // =======================

    coupon.activate();

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

      deletedAt: updated.deletedAt,
    };
  }
}

// src/modules/coupon/application/use-cases/redeem-coupon.use-case.ts

import { Injectable } from '@nestjs/common';

import { CouponApplicationService } from '../services/coupon-application.service';

@Injectable()
export class RedeemCouponUseCase {
  constructor(
    private readonly couponApplicationService: CouponApplicationService,
  ) {}

  async execute(input: {
    couponId: string;

    userId: string;

    orderId: string;

    discountAmount: number;
  }) {
    // =======================
    // 🎟 REDEEM COUPON
    // =======================

    await this.couponApplicationService.incrementUsage({
      couponId: input.couponId,

      userId: input.userId,

      orderId: input.orderId,

      discountAmount: input.discountAmount,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      success: true,

      couponId: input.couponId,

      userId: input.userId,

      orderId: input.orderId,

      discountAmount: input.discountAmount,
    };
  }
}
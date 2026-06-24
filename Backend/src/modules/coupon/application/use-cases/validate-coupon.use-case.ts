// src/modules/coupon/application/use-cases/validate-coupon.use-case.ts

import { Injectable } from '@nestjs/common';

import { CouponApplicationService } from '../services/coupon-application.service';

@Injectable()
export class ValidateCouponUseCase {
  constructor(private readonly couponApplicationService: CouponApplicationService) {}

  async execute(input: {
    couponCode: string;

    subtotal: number;

    userId?: string;
  }) {
    // =======================
    // 🎟 VALIDATE + CALCULATE
    // =======================

    const result = await this.couponApplicationService.validateAndCalculate({
      couponCode: input.couponCode,

      subtotal: input.subtotal,

      userId: input.userId,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      couponId: result.coupon.id,

      couponCode: result.coupon.code,

      discountType: result.coupon.discountType,

      discountValue: result.coupon.discountValue,

      discount: result.discount,

      minimumOrderAmount: result.coupon.minimumOrderAmount,

      maximumDiscountAmount: result.coupon.maximumDiscountAmount,

      usageLimit: result.coupon.usageLimit,

      usedCount: result.coupon.usedCount,

      perUserLimit: result.coupon.perUserLimit,

      status: result.coupon.status,

      isPublic: result.coupon.isPublic,

      startsAt: result.coupon.startsAt,

      expiresAt: result.coupon.expiresAt,
    };
  }
}

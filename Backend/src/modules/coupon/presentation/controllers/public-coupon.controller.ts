// src/modules/coupon/presentation/controllers/public-coupon.controller.ts

import { Body, Controller, Get, Query, Post } from '@nestjs/common';

import { ListCouponsUseCase } from '../../application/use-cases/list-coupons.use-case';

import { ValidateCouponUseCase } from '../../application/use-cases/validate-coupon.use-case';

import { CouponStatus } from '../../domain/enums/coupon-status.enum';

@Controller('coupons')
export class PublicCouponController {
  constructor(
    private readonly listCouponsUseCase: ListCouponsUseCase,

    private readonly validateCouponUseCase: ValidateCouponUseCase,
  ) {}

  // =======================
  // 📋 ACTIVE PUBLIC COUPONS
  // =======================

  @Get()
  async listCoupons(
    @Query('status')
    status?: CouponStatus,
  ) {
    return this.listCouponsUseCase.execute({
      status: status ?? CouponStatus.ACTIVE,
    });
  }

  // =======================
  // 🛡 VALIDATE
  // =======================

  @Post('validate')
  async validateCoupon(
    @Body()
    body: {
      couponCode: string;

      subtotal: number;
    },
  ) {
    return this.validateCouponUseCase.execute({
      couponCode: body.couponCode,

      subtotal: body.subtotal,
    });
  }
}

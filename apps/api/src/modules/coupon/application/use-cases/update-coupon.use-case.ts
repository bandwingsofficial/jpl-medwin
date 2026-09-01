// src/modules/coupon/application/use-cases/update-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponDomainService } from '../../domain/services/coupon-domain.service';

import { CouponDiscountType } from '../../domain/enums/coupon-discount-type.enum';

import { CouponStatus } from '../../domain/enums/coupon-status.enum';

import { CouponNotFoundException } from '../../domain/exceptions/coupon-not-found.exception';

@Injectable()
export class UpdateCouponUseCase {
  constructor(
    @Inject(TOKENS.COUPON_REPO)
    private readonly couponRepo: CouponRepository,

    private readonly domainService: CouponDomainService,
  ) {}

  async execute(input: {
    couponId: string;

    code?: string;

    discountType?: CouponDiscountType;

    discountValue?: number;

    minimumOrderAmount?: number;

    maximumDiscountAmount?: number;

    usageLimit?: number;

    perUserLimit?: number;

    status?: CouponStatus;

    isPublic?: boolean;

    startsAt?: Date;

    expiresAt?: Date;
  }) {
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
    // 🔤 NORMALIZE CODE
    // =======================

    let normalizedCode: string | undefined;

    if (input.code !== undefined) {
      normalizedCode = this.domainService.normalizeCouponCode(input.code);

      // =======================
      // 🔍 CHECK DUPLICATE
      // =======================

      const existing = await this.couponRepo.findByCodeIncludingDeleted(normalizedCode);

      if (existing && existing.id !== coupon.id) {
        this.domainService.ensureCouponCodeAvailable({
          code: normalizedCode,

          existing,
        });
      }
    }

    // =======================
    // 🛡 VALIDATE DISCOUNT
    // =======================

    if (input.discountType !== undefined || input.discountValue !== undefined) {
      this.domainService.validateDiscount({
        discountType: input.discountType ?? coupon.discountType,

        discountValue: input.discountValue ?? coupon.discountValue,
      });
    }

    // =======================
    // ⏰ VALIDATE DATES
    // =======================

    this.domainService.validateCouponDates({
      startsAt: input.startsAt ?? coupon.startsAt,

      expiresAt: input.expiresAt ?? coupon.expiresAt,
    });

    // =======================
    // ✏️ UPDATE ENTITY
    // =======================

    coupon.updateDetails({
      code: normalizedCode,

      discountType: input.discountType,

      discountValue: input.discountValue,

      minimumOrderAmount: input.minimumOrderAmount,

      maximumDiscountAmount: input.maximumDiscountAmount,

      usageLimit: input.usageLimit,

      perUserLimit: input.perUserLimit,

      status: input.status,

      isPublic: input.isPublic,

      startsAt: input.startsAt,

      expiresAt: input.expiresAt,
    });

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

      discountType: updated.discountType,

      discountValue: updated.discountValue,

      minimumOrderAmount: updated.minimumOrderAmount,

      maximumDiscountAmount: updated.maximumDiscountAmount,

      usageLimit: updated.usageLimit,

      usedCount: updated.usedCount,

      perUserLimit: updated.perUserLimit,

      status: updated.status,

      isPublic: updated.isPublic,

      startsAt: updated.startsAt,

      expiresAt: updated.expiresAt,

      updatedAt: updated.updatedAt,
    };
  }
}

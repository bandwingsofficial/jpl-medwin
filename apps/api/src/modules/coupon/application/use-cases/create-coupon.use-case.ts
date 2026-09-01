// src/modules/coupon/application/use-cases/create-coupon.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { Coupon } from '../../domain/entities/coupon.entity';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponDomainService } from '../../domain/services/coupon-domain.service';

import { CouponDiscountType } from '../../domain/enums/coupon-discount-type.enum';

import { CouponStatus } from '../../domain/enums/coupon-status.enum';

@Injectable()
export class CreateCouponUseCase {
  constructor(
    @Inject(TOKENS.COUPON_REPO)
    private readonly couponRepo: CouponRepository,

    private readonly domainService: CouponDomainService,
  ) {}

  async execute(input: {
    code: string;

    discountType: CouponDiscountType;

    discountValue: number;

    minimumOrderAmount?: number;

    maximumDiscountAmount?: number;

    usageLimit?: number;

    perUserLimit?: number;

    isPublic?: boolean;

    startsAt?: Date;

    expiresAt?: Date;
  }) {
    // =======================
    // 🔤 NORMALIZE CODE
    // =======================

    const normalizedCode = this.domainService.normalizeCouponCode(input.code);

    // =======================
    // 🔍 CHECK EXISTING
    // =======================

    const existing = await this.couponRepo.findByCodeIncludingDeleted(normalizedCode);

    // =======================
    // ❌ ACTIVE COUPON EXISTS
    // =======================

    if (existing && !existing.deletedAt) {
      this.domainService.ensureCouponCodeAvailable({
        code: normalizedCode,

        existing,
      });
    }

    // =======================
    // 🛡 VALIDATE DISCOUNT
    // =======================

    this.domainService.validateDiscount({
      discountType: input.discountType,

      discountValue: input.discountValue,
    });

    // =======================
    // ⏰ VALIDATE DATES
    // =======================

    this.domainService.validateCouponDates({
      startsAt: input.startsAt,

      expiresAt: input.expiresAt,
    });

    // =======================
    // ♻️ RESTORE DELETED
    // =======================

    if (existing && existing.deletedAt) {
      // restore
      existing.restore();

      // activate
      existing.activate();

      // update
      existing.updateDetails({
        code: normalizedCode,

        discountType: input.discountType,

        discountValue: input.discountValue,

        minimumOrderAmount: input.minimumOrderAmount,

        maximumDiscountAmount: input.maximumDiscountAmount,

        usageLimit: input.usageLimit,

        perUserLimit: input.perUserLimit,

        status: CouponStatus.ACTIVE,

        isPublic: input.isPublic,

        startsAt: input.startsAt,

        expiresAt: input.expiresAt,
      });

      // validate
      existing.validate();

      // save
      const restored = await this.couponRepo.update(existing);

      // response
      return {
        id: restored.id,

        code: restored.code,

        discountType: restored.discountType,

        discountValue: restored.discountValue,

        minimumOrderAmount: restored.minimumOrderAmount,

        maximumDiscountAmount: restored.maximumDiscountAmount,

        usageLimit: restored.usageLimit,

        usedCount: restored.usedCount,

        perUserLimit: restored.perUserLimit,

        status: restored.status,

        isPublic: restored.isPublic,

        startsAt: restored.startsAt,

        expiresAt: restored.expiresAt,

        updatedAt: restored.updatedAt,
      };
    }

    // =======================
    // 🎟 CREATE ENTITY
    // =======================

    const coupon = new Coupon(
      randomUUID(),

      // =======================
      // 🎟 BASIC
      // =======================

      normalizedCode,

      input.discountType,

      input.discountValue,

      // =======================
      // 💰 LIMITS
      // =======================

      input.minimumOrderAmount,

      input.maximumDiscountAmount,

      input.usageLimit,

      0,

      input.perUserLimit,

      // =======================
      // 🚦 STATUS
      // =======================

      CouponStatus.ACTIVE,

      input.isPublic ?? true,

      // =======================
      // ⏰ VALIDITY
      // =======================

      input.startsAt,

      input.expiresAt,
    );

    // =======================
    // 🛡 ENTITY VALIDATION
    // =======================

    coupon.validate();

    // =======================
    // 💾 SAVE
    // =======================

    const created = await this.couponRepo.create(coupon);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: created.id,

      code: created.code,

      discountType: created.discountType,

      discountValue: created.discountValue,

      minimumOrderAmount: created.minimumOrderAmount,

      maximumDiscountAmount: created.maximumDiscountAmount,

      usageLimit: created.usageLimit,

      usedCount: created.usedCount,

      perUserLimit: created.perUserLimit,

      status: created.status,

      isPublic: created.isPublic,

      startsAt: created.startsAt,

      expiresAt: created.expiresAt,

      createdAt: created.createdAt,
    };
  }
}

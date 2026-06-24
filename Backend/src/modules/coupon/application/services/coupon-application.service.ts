// src/modules/coupon/application/services/coupon-application.service.ts

import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { Coupon } from '../../domain/entities/coupon.entity';

import { CouponRepository } from '../../domain/repositories/coupon.repository';

import { CouponDomainService } from '../../domain/services/coupon-domain.service';

import { CouponNotFoundException } from '../../domain/exceptions/coupon-not-found.exception';

import { InvalidCouponException } from '../../domain/exceptions/invalid-coupon.exception';

@Injectable()
export class CouponApplicationService {
  constructor(
    @Inject(TOKENS.COUPON_REPO)
    private readonly couponRepo: CouponRepository,

    private readonly domainService: CouponDomainService,
  ) {}

  // =======================
  // 🔍 FIND BY ID
  // =======================

  async findCouponById(couponId: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findById(couponId);

    if (!coupon) {
      throw new CouponNotFoundException({
        couponId,
      });
    }

    return coupon;
  }

  // =======================
  // 🔍 FIND BY CODE
  // =======================

  async findCouponByCode(couponCode: string): Promise<Coupon> {
    // =======================
    // 🔤 NORMALIZE
    // =======================

    const normalizedCode =
      this.domainService.normalizeCouponCode(couponCode);

    // =======================
    // 🔍 FIND
    // =======================

    const coupon = await this.couponRepo.findByCode(normalizedCode);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!coupon) {
      throw new CouponNotFoundException({
        couponCode: normalizedCode,
      });
    }

    return coupon;
  }

  // =======================
  // 🛡 VALIDATE COUPON
  // =======================

  async validateCoupon(params: {
    couponCode: string;

    subtotal: number;

    userId?: string;
  }): Promise<Coupon> {
    const { couponCode, subtotal, userId } = params;

    // =======================
    // ❌ INVALID SUBTOTAL
    // =======================

    if (subtotal <= 0) {
      throw new InvalidCouponException({
        message: 'Subtotal must be greater than 0',
      });
    }

    // =======================
    // 🔍 FIND COUPON
    // =======================

    const coupon = await this.findCouponByCode(couponCode);

    // =======================
    // 🛡 ENSURE USABLE
    // =======================

    coupon.ensureUsable();

    // =======================
    // 📊 USAGE LIMIT
    // =======================

    if (
      coupon.usageLimit !== undefined &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      throw new InvalidCouponException({
        message: 'Coupon usage limit exceeded',
      });
    }

    // =======================
    // 👤 PER USER LIMIT
    // =======================

    if (userId && coupon.perUserLimit) {
      const userUsageCount =
        await this.couponRepo.countUserCouponUsage({
          couponId: coupon.id,

          userId,
        });

      if (userUsageCount >= coupon.perUserLimit) {
        throw new InvalidCouponException({
          message: 'Per-user coupon usage limit exceeded',
        });
      }
    }

    // =======================
    // 💰 VALIDATE DISCOUNT
    // =======================

    coupon.calculateDiscount(subtotal);

    return coupon;
  }

  // =======================
  // 💰 CALCULATE DISCOUNT
  // =======================

  calculateDiscount(params: {
    coupon: Coupon;

    subtotal: number;
  }): number {
    const { coupon, subtotal } = params;

    // =======================
    // 💰 CALCULATE
    // =======================

    const discount = this.domainService.calculateDiscount({
      coupon,

      subtotal,
    });

    // =======================
    // ❌ NEGATIVE
    // =======================

    if (discount < 0) {
      throw new InvalidCouponException({
        message: 'Invalid discount calculated',
      });
    }

    // =======================
    // ❌ OVER SUBTOTAL
    // =======================

    if (discount > subtotal) {
      throw new InvalidCouponException({
        message: 'Discount cannot exceed subtotal',
      });
    }

    return discount;
  }

  // =======================
  // 🎟 VALIDATE + CALCULATE
  // =======================

  async validateAndCalculate(params: {
    couponCode: string;

    subtotal: number;

    userId?: string;
  }) {
    const { couponCode, subtotal, userId } = params;

    // =======================
    // 🛡 VALIDATE
    // =======================

    const coupon = await this.validateCoupon({
      couponCode,

      subtotal,

      userId,
    });

    // =======================
    // 💰 CALCULATE
    // =======================

    const discount = this.calculateDiscount({
      coupon,

      subtotal,
    });

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      coupon,

      discount,
    };
  }

  // =======================
  // 🎟 REDEEM COUPON
  // =======================

  async incrementUsage(params: {
    couponId: string;

    userId: string;

    orderId: string;

    discountAmount: number;
  }): Promise<void> {
    const { couponId, userId, orderId, discountAmount } = params;

    // =======================
    // 🔍 FIND COUPON
    // =======================

    const coupon = await this.findCouponById(couponId);

    // =======================
    // 🛡 FINAL VALIDATION
    // =======================

    coupon.ensureUsable();

    // =======================
    // 📊 LIMIT CHECK
    // =======================

    if (
      coupon.usageLimit !== undefined &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      throw new InvalidCouponException({
        message: 'Coupon usage limit exceeded',
      });
    }

    // =======================
    // 👤 USER LIMIT CHECK
    // =======================

    if (coupon.perUserLimit) {
      const userUsageCount =
        await this.couponRepo.countUserCouponUsage({
          couponId,

          userId,
        });

      if (userUsageCount >= coupon.perUserLimit) {
        throw new InvalidCouponException({
          message: 'Per-user coupon usage limit exceeded',
        });
      }
    }

    // =======================
    // 🎟 REDEEM
    // =======================

    await this.couponRepo.redeemCoupon({
      couponId,

      userId,

      orderId,

      discountAmount,
    });
  }
}
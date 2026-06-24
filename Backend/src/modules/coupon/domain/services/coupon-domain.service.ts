// src/modules/coupon/domain/services/coupon-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Coupon } from '../entities/coupon.entity';

import { CouponDiscountType } from '../enums/coupon-discount-type.enum';

import { CouponCodeAlreadyExistsException } from '../exceptions/coupon-code-already-exists.exception';

import { InvalidCouponException } from '../exceptions/invalid-coupon.exception';

@Injectable()
export class CouponDomainService {
  // =======================
  // 🎟 CODE VALIDATION
  // =======================

  ensureCouponCodeAvailable(params: {
    code: string;

    existing?: Coupon | null;
  }) {
    const { code, existing } = params;

    if (existing) {
      throw new CouponCodeAlreadyExistsException({
        couponCode: code,
      });
    }
  }

  // =======================
  // 🎟 CODE NORMALIZATION
  // =======================

  normalizeCouponCode(code?: string): string {
  if (!code || !code.trim()) {
    throw new InvalidCouponException({
      message: 'Coupon code is required',
    });
  }

  return code.trim().toUpperCase();
}

  // =======================
  // 💰 DISCOUNT VALIDATION
  // =======================

  validateDiscount(params: {
    discountType: CouponDiscountType;

    discountValue: number;
  }) {
    const { discountType, discountValue } = params;

    // =======================
    // ❌ INVALID VALUE
    // =======================

    if (discountValue <= 0) {
      throw new InvalidCouponException({});
    }

    // =======================
    // 📊 PERCENTAGE
    // =======================

    if (discountType === CouponDiscountType.PERCENTAGE && discountValue > 100) {
      throw new InvalidCouponException({
        message: 'Percentage discount cannot exceed 100',
      });
    }
  }

  // =======================
  // ⏰ DATE VALIDATION
  // =======================

  validateCouponDates(params: {
    startsAt?: Date;

    expiresAt?: Date;
  }) {
    const { startsAt, expiresAt } = params;

    if (startsAt && expiresAt && startsAt > expiresAt) {
      throw new InvalidCouponException({
        message: 'Start date cannot be after expiry date',
      });
    }
  }

  // =======================
  // 💰 DISCOUNT CALCULATION
  // =======================

  calculateDiscount(params: {
    coupon: Coupon;

    subtotal: number;
  }): number {
    const { coupon, subtotal } = params;

    return coupon.calculateDiscount(subtotal);
  }
}

// src/modules/coupon/application/dto/update-coupon.dto.ts

import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Type } from 'class-transformer';

import { CouponDiscountType } from '../../domain/enums/coupon-discount-type.enum';

import { CouponStatus } from '../../domain/enums/coupon-status.enum';

export class UpdateCouponDto {
  // =======================
  // 🎟 BASIC
  // =======================

  @IsOptional()
  @IsString()
  code?: string;

  // =======================
  // 💰 DISCOUNT
  // =======================

  @IsOptional()
  @IsEnum(CouponDiscountType)
  discountType?: CouponDiscountType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100000)
  discountValue?: number;

  // =======================
  // 💰 LIMITS
  // =======================

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minimumOrderAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maximumDiscountAmount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  perUserLimit?: number;

  // =======================
  // 🚦 STATUS
  // =======================

  @IsOptional()
  @IsEnum(CouponStatus)
  status?: CouponStatus;

  // =======================
  // 🌍 VISIBILITY
  // =======================

  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  // =======================
  // ⏰ VALIDITY
  // =======================

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startsAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  expiresAt?: Date;
}

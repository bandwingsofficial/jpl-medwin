// src/modules/coupon/application/dto/create-coupon.dto.ts

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

export class CreateCouponDto {
  // =======================
  // 🎟 BASIC
  // =======================

  @IsString()
  code!: string;

  // =======================
  // 💰 DISCOUNT
  // =======================

  @IsEnum(CouponDiscountType)
  discountType!: CouponDiscountType;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @Min(1)
  @Max(100000)
  discountValue!: number;

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

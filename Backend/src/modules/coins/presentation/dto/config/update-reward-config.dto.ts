// update-reward-config.dto.ts

import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class UpdateRewardConfigDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  earnRateAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  earnRateCoins?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  coinValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxRedemptionPercentage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumOrderAmount?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  expiryMonths?: number;

  @IsOptional()
  @IsBoolean()
  rewardOnDelivered?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
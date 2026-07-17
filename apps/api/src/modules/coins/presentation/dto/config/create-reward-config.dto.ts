// create-reward-config.dto.ts

import { IsBoolean, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateRewardConfigDto {
  @IsNumber()
  @Min(1)
  earnRateAmount!: number;

  @IsInt()
  @Min(1)
  earnRateCoins!: number;

  @IsNumber()
  @Min(0.01)
  coinValue!: number;

  @IsNumber()
  @Min(0)
  maxRedemptionPercentage!: number;

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

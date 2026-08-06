// update-reward-tier.dto.ts

import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { RewardTierStatus } from '../../../domain/enums/reward-tier-status.enum';

export class UpdateRewardTierDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  coinMultiplier?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minimumLifetimeSpend?: number;

  @IsOptional()
  @IsString()
  badgeImage?: string;

  @IsOptional()
  @IsEnum(RewardTierStatus)
  status?: RewardTierStatus;
}

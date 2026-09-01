// create-reward-tier.dto.ts

import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { RewardTierStatus } from '../../../domain/enums/reward-tier-status.enum';

export class CreateRewardTierDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(1)
  coinMultiplier!: number;

  @IsNumber()
  @Min(0)
  minimumLifetimeSpend!: number;

  @IsOptional()
  @IsString()
  badgeImage?: string;

  @IsOptional()
  @IsEnum(RewardTierStatus)
  status?: RewardTierStatus;
}

// credit-coins.dto.ts

import { IsDateString, IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';
import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

export class CreditCoinsDto {
  @IsString()
  userId!: string;

  @IsInt()
  @Min(1)
  coins!: number;

  @IsEnum(CoinTransactionType)
  type!: CoinTransactionType;

  @IsEnum(RewardSourceType)
  sourceType!: RewardSourceType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsString()
  redemptionId?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  createdByAdminId?: string;

  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}

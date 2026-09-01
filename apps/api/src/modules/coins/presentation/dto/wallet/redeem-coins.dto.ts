// redeem-coins.dto.ts

import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class RedeemCoinsDto {
  @IsString()
  orderId!: string;

  @IsInt()
  @Min(1)
  coins!: number;

  @IsInt()
  @Min(1)
  orderAmount!: number;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}

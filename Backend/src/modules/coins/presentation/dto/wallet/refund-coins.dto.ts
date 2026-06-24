// dto/wallet/refund-coins.dto.ts

import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RefundCoinsDto {
  @IsString()
  userId!: string;

  @IsString()
  orderId!: string;

  @IsInt()
  @Min(1)
  coins!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
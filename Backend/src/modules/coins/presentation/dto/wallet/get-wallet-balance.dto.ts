// get-wallet-balance.dto.ts

import {
  IsOptional,
  IsString,
} from 'class-validator';

export class GetWalletBalanceDto {
  @IsOptional()
  @IsString()
  walletId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
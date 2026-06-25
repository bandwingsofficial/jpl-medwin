// get-wallet.dto.ts

import { IsOptional, IsString } from 'class-validator';

export class GetWalletDto {
  @IsOptional()
  @IsString()
  walletId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

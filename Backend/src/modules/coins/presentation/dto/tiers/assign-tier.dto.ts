// assign-tier.dto.ts

import { IsNumber, IsString, Min } from 'class-validator';

export class AssignTierDto {
  @IsString()
  userId!: string;

  @IsNumber()
  @Min(0)
  lifetimeSpend!: number;

  @IsNumber()
  @Min(1)
  baseCoins!: number;
}

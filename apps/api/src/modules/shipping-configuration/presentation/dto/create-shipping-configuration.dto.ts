import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateShippingConfigurationDto {
  @IsNumber()
  @Min(0)
  shippingFee!: number;

  @IsNumber()
  @Min(0.01)
  freeShippingThreshold!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  overweightChargePerKg?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

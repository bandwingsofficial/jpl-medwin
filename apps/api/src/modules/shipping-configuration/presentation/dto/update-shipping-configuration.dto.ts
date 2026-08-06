import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateShippingConfigurationDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  shippingFee?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  freeShippingThreshold?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

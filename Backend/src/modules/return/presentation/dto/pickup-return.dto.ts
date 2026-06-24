import { IsOptional, IsString } from 'class-validator';

export class PickupReturnDto {
  @IsOptional()
  @IsString()
  trackingId?: string;
}
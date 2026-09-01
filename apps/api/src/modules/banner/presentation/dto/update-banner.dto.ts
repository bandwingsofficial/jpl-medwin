import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Min } from 'class-validator';

import { BannerType } from '../../domain/enums/banner-type.enum';

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(BannerType)
  type?: BannerType;

  @IsOptional()
  @Type(() => Number)
  @Min(1, { message: 'Priority must be at least 1' })
  priority?: number;
}

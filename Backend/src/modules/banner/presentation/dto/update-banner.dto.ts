import { IsEnum, IsOptional, IsString } from 'class-validator';

import { BannerType } from '../../domain/enums/banner-type.enum';

export class UpdateBannerDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(BannerType)
  type?: BannerType;
}

import {
  IsEnum,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

import { BannerType } from '../../domain/enums/banner-type.enum';

class CreateBannerImageDto {
  @IsOptional()
  @IsString()
  productId?: string;

  @IsOptional()
  @Min(0)
  sortOrder?: number;
}

export class CreateBannerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEnum(BannerType)
  type!: BannerType;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBannerImageDto)
  images?: CreateBannerImageDto[];
}
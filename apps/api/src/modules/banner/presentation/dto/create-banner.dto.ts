import { IsEnum, IsOptional, IsString, Min, MinLength, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';

import { BannerType } from '../../domain/enums/banner-type.enum';

class CreateBannerImageDto {
  @IsOptional()
  @IsString()
  link?: string;

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
  @Type(() => Number)
  @Min(1, { message: 'Priority must be at least 1' })
  priority?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBannerImageDto)
  images?: CreateBannerImageDto[];
}

// src/modules/brand/application/dto/create-brand.dto.ts

import { IsString, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(6)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: 'SKU Prefix must be alphanumeric',
  })
  skuPrefix!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  metaDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;
}

// src/modules/collection/application/dto/update-collection.dto.ts

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Order must be an integer' })
  @Min(1, { message: 'Order must be at least 1' })
  order?: number;
}

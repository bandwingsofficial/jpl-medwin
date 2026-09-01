// src/modules/collection/application/dto/create-collection.dto.ts

import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  name!: string;

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

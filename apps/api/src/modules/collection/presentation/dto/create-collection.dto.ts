// src/modules/collection/application/dto/create-collection.dto.ts

import { IsOptional, IsString } from 'class-validator';

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
}

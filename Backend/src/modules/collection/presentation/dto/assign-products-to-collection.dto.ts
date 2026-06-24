// src/modules/collection/application/dto/add-product-to-collection.dto.ts

import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class AddProductToCollectionDto {
  @IsUUID()
  @IsNotEmpty()
  productId!: string;
}
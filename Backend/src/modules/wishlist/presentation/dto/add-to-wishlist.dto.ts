// src/modules/wishlist/presentation/dto/add-to-wishlist.dto.ts

import { IsString } from 'class-validator';

export class AddToWishlistDto {
  @IsString()
  productId!: string;
}

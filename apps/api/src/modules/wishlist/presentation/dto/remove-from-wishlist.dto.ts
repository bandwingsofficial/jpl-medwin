// src/modules/wishlist/presentation/dto/remove-from-wishlist.dto.ts

import { IsString } from 'class-validator';

export class RemoveFromWishlistDto {
  @IsString()
  productId!: string;
}

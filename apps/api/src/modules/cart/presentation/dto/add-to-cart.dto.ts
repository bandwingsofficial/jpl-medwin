// src/modules/cart/presentation/dto/add-to-cart.dto.ts

import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  productId!: string;

  @IsString()
  variantId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  // guest support
  @IsOptional()
  @IsString()
  guestId?: string;
}

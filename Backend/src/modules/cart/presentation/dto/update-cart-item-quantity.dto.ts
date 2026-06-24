// src/modules/cart/presentation/dto/update-cart-item-quantity.dto.ts

import { IsInt, Min } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsInt()
  @Min(1)
  quantity!: number;
}

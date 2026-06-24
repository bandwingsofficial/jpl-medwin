// src/modules/wishlist/presentation/controllers/wishlist.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AuthRequest } from '@/modules/auth/types/auth-request.type';

import { AddToWishlistUseCase } from '../../application/use-cases/add-to-wishlist.use-case';
import { RemoveFromWishlistUseCase } from '../../application/use-cases/remove-from-wishlist.use-case';
import { GetWishlistUseCase } from '../../application/use-cases/get-wishlist.use-case';
import { GetWishlistCountUseCase } from '../../application/use-cases/get-wishlist-count.use-case';

import { AddToWishlistDto } from '../dto/add-to-wishlist.dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(
    private readonly addToWishlistUseCase: AddToWishlistUseCase,

    private readonly removeFromWishlistUseCase: RemoveFromWishlistUseCase,

    private readonly getWishlistUseCase: GetWishlistUseCase,

    private readonly getWishlistCountUseCase: GetWishlistCountUseCase,
  ) {}

  // =======================
  // ❤️ ADD TO WISHLIST
  // =======================

  @Post()
  async addToWishlist(
    @Req() req: AuthRequest,

    @Body()
    dto: AddToWishlistDto,
  ) {
    const data =
      await this.addToWishlistUseCase.execute({
        userId: req.user.userId,

        productId: dto.productId,
      });

    return {
      message: 'Product added to wishlist',

      ...data,
    };
  }

  // =======================
  // 🗑 REMOVE FROM WISHLIST
  // =======================

  @Delete(':productId')
  async removeFromWishlist(
    @Req() req: AuthRequest,

    @Param('productId')
    productId: string,
  ) {
    await this.removeFromWishlistUseCase.execute({
      userId: req.user.userId,

      productId,
    });

    return {
      message: 'Product removed from wishlist',
    };
  }

  // =======================
  // ❤️ GET WISHLIST
  // =======================

  @Get()
  async getWishlist(
    @Req() req: AuthRequest,
  ) {
    const data =
      await this.getWishlistUseCase.execute(
        req.user.userId,
      );

    return {
      message: 'Wishlist fetched successfully',

      ...data,
    };
  }

  // =======================
  // 🔢 COUNT
  // =======================

  @Get('count')
  async getWishlistCount(
    @Req() req: AuthRequest,
  ) {
    const data =
      await this.getWishlistCountUseCase.execute(
        req.user.userId,
      );

    return {
      message:
        'Wishlist count fetched successfully',

      ...data,
    };
  }
}
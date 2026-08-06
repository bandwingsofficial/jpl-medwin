// src/modules/cart/presentation/controllers/cart.controller.ts

import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AddToCartUseCase } from '../../application/use-cases/add-to-cart.use-case';
import { GetCartUseCase } from '../../application/use-cases/get-cart.use-case';
import { UpdateCartItemQuantityUseCase } from '../../application/use-cases/update-cart-item-quantity.use-case';
import { ClearCartUseCase } from '../../application/use-cases/clear-cart.use-case';

import { AddToCartDto } from '../dto/add-to-cart.dto';
import { UpdateCartItemQuantityDto } from '../dto/update-cart-item-quantity.dto';
import { AuthRequest } from '@/modules/auth/types/auth-request.type';
import { RemoveCartItemUseCase } from '../../application/use-cases/remove-cart-item.use-case';
import { UnlockCartUseCase } from '../../application/use-cases/unlock-cart.use-case';
import { LockCartUseCase } from '../../application/use-cases/lock-cart.use-case';
import { ConvertCartUseCase } from '../../application/use-cases/assign-guest-cart-to-user.use-case';
import { MergeCartUseCase } from '../../application/use-cases/merge-cart.use-case';
import { ApplyCouponUseCase } from '../../application/use-cases/apply-coupon.use-case';
import { RemoveCouponUseCase } from '../../application/use-cases/remove-coupon.use-case';
// import { CreateCheckoutSessionUseCase } from '../../application/use-cases/create-checkout-session.use-case';

@Controller('cart')
export class CartController {
  constructor(
    private readonly addToCart: AddToCartUseCase,
    private readonly getCart: GetCartUseCase,
    private readonly updateCartItemQuantity: UpdateCartItemQuantityUseCase,
    private readonly removeCartItem: RemoveCartItemUseCase,
    private readonly clearCartUseCase: ClearCartUseCase,
    private readonly lockCartUseCase: LockCartUseCase,
    private readonly unlockCartUseCase: UnlockCartUseCase,
    private readonly mergeCartUseCase: MergeCartUseCase,
    private readonly convertCartUseCase: ConvertCartUseCase,
    private readonly applyCouponUseCase: ApplyCouponUseCase,
    private readonly removeCouponUseCase: RemoveCouponUseCase,
    // private readonly createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,
  ) {}

  // =======================
  // 🛒 ADD TO CART
  // =======================

  @Post('items')
  @UseGuards(JwtAuthGuard)
  async addItem(
    @Req() req: AuthRequest,

    @Body()
    dto: AddToCartDto,
  ) {
    const data = await this.addToCart.execute({
      userId: req.user.userId,

      guestId: dto.guestId,

      productId: dto.productId,

      variantId: dto.variantId,

      quantity: dto.quantity,
    });

    return {
      message: 'Item added to cart',

      ...data,
    };
  }

  // =======================
  // 📦 GET CART
  // =======================

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyCart(
    @Req() req: AuthRequest,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.getCart.execute({
      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Cart fetched successfully',

      ...data,
    };
  }

  // =======================
  // 🔄 UPDATE QUANTITY
  // =======================

  @Patch('items/:itemId')
  @UseGuards(JwtAuthGuard)
  async updateQuantity(
    @Param('itemId')
    itemId: string,

    @Body()
    dto: UpdateCartItemQuantityDto,
  ) {
    const data = await this.updateCartItemQuantity.execute({
      itemId,

      quantity: dto.quantity,
    });

    return {
      message: 'Cart item updated successfully',

      ...data,
    };
  }

  // =======================
  // 🗑 REMOVE CART ITEM
  // =======================

  @Delete('items/:itemId')
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @Param('itemId')
    itemId: string,
  ) {
    const data = await this.removeCartItem.execute({
      itemId,
    });

    return {
      message: 'Cart item removed successfully',

      ...data,
    };
  }

  // =======================
  // 🗑 CLEAR CART
  // =======================

  @Delete()
  @UseGuards(JwtAuthGuard)
  async clearCart(
    @Req() req: AuthRequest,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.clearCartUseCase.execute({
      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Cart cleared successfully',

      ...data,
    };
  }

  // =======================
  // 🔒 LOCK CART
  // =======================

  @Post('lock')
  @UseGuards(JwtAuthGuard)
  async lockCart(
    @Req() req: AuthRequest,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.lockCartUseCase.execute({
      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Cart locked successfully',

      ...data,
    };
  }

  // =======================
  // 🔓 UNLOCK CART
  // =======================

  @Post('unlock')
  @UseGuards(JwtAuthGuard)
  async unlockCart(
    @Req() req: AuthRequest,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.unlockCartUseCase.execute({
      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Cart unlocked successfully',

      ...data,
    };
  }

  // =======================
  // 🔄 MERGE CART
  // =======================

  @Post('merge')
  @UseGuards(JwtAuthGuard)
  async mergeCart(
    @Req() req: AuthRequest,

    @Body()
    body: {
      guestId: string;
    },
  ) {
    const data = await this.mergeCartUseCase.execute({
      userId: req.user.userId,

      guestId: body.guestId,
    });

    return {
      message: 'Cart merged successfully',

      data,
    };
  }

  // =======================
  // 🔄 CONVERT CART
  // =======================

  @Post('convert')
  @UseGuards(JwtAuthGuard)
  async convertCart(
    @Req() req: AuthRequest,

    @Body()
    body: {
      guestId: string;
    },
  ) {
    const data = await this.convertCartUseCase.execute({
      userId: req.user.userId,

      guestId: body.guestId,
    });

    return {
      message: 'Cart converted successfully',

      data,
    };
  }

  // =======================
  // 🎟 APPLY COUPON
  // =======================

  @Post('apply-coupon')
  @UseGuards(JwtAuthGuard)
  async applyCoupon(
    @Req() req: AuthRequest,

    @Body()
    body: {
      couponCode: string;
    },

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.applyCouponUseCase.execute({
      userId: req.user.userId,

      guestId,

      couponCode: body.couponCode,
    });

    return {
      message: 'Coupon applied successfully',

      ...data,
    };
  }

  // =======================
  // 🗑 REMOVE COUPON
  // =======================

  @Delete('remove-coupon')
  @UseGuards(JwtAuthGuard)
  async removeCoupon(
    @Req() req: AuthRequest,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.removeCouponUseCase.execute({
      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Coupon removed successfully',

      ...data,
    };
  }

  //   // =======================
  // // 💳 CREATE CHECKOUT SESSION
  // // =======================

  // @Post('checkout')
  // @UseGuards(JwtAuthGuard)
  // async checkout(
  //   @Req() req: AuthRequest,

  //   @Query('guestId')
  //   guestId?: string,
  // ) {
  //   const data =
  //     await this.createCheckoutSessionUseCase.execute(
  //       {
  //         userId:
  //           req.user.userId,

  //         guestId,
  //       },
  //     );

  //   return {
  //     message:
  //       'Checkout session created successfully',

  //     ...data,
  //   };
  // }
}

// src/modules/checkout-session/presentation/controllers/checkout-session.controller.ts

import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { AuthRequest } from '@/modules/auth/types/auth-request.type';

import { CreateCheckoutSessionUseCase } from '../../application/use-cases/create-checkout-session.use-case';

import { GetCheckoutSessionUseCase } from '../../application/use-cases/get-checkout-session.use-case';

import { ExpireCheckoutSessionUseCase } from '../../application/use-cases/expire-checkout-session.use-case';

import { CompleteCheckoutSessionUseCase } from '../../application/use-cases/complete-checkout-session.use-case';

import { ApplyRewardsToCheckoutUseCase } from '../../application/use-cases/apply-rewards-to-checkout.use-case';

import { RemoveRewardsFromCheckoutUseCase } from '../../application/use-cases/remove-rewards-from-checkout.use-case';

@Controller('checkout-sessions')
export class CheckoutSessionController {
  constructor(
    private readonly createCheckoutSessionUseCase: CreateCheckoutSessionUseCase,

    private readonly getCheckoutSessionUseCase: GetCheckoutSessionUseCase,

    private readonly expireCheckoutSessionUseCase: ExpireCheckoutSessionUseCase,

    private readonly completeCheckoutSessionUseCase: CompleteCheckoutSessionUseCase,

    // =======================
    // 🪙 REWARDS
    // =======================

    private readonly applyRewardsToCheckoutUseCase: ApplyRewardsToCheckoutUseCase,

    private readonly removeRewardsFromCheckoutUseCase: RemoveRewardsFromCheckoutUseCase,
  ) {}

  // =======================
  // 🎟 CREATE CHECKOUT SESSION
  // =======================

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() req: AuthRequest,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.createCheckoutSessionUseCase.execute({
      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Checkout session created successfully',

      ...data,
    };
  }

  // =======================
  // 📦 GET CHECKOUT SESSION
  // =======================

  @Get(':checkoutSessionId')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Req() req: AuthRequest,

    @Param('checkoutSessionId')
    checkoutSessionId: string,

    @Query('guestId')
    guestId?: string,
  ) {
    const data = await this.getCheckoutSessionUseCase.execute({
      checkoutSessionId,

      userId: req.user.userId,

      guestId,
    });

    return {
      message: 'Checkout session fetched successfully',

      ...data,
    };
  }

  // =======================
  // 🪙 APPLY REWARDS
  // =======================

  @Post(':checkoutSessionId/apply-rewards')
  @UseGuards(JwtAuthGuard)
  async applyRewards(
    @Req() req: AuthRequest,

    @Param('checkoutSessionId')
    checkoutSessionId: string,

    @Body()
    body: {
      coins: number;
    },
  ) {
    const data = await this.applyRewardsToCheckoutUseCase.execute({
      checkoutSessionId,

      userId: req.user.userId,

      coins: body.coins,
    });

    return {
      message: 'Rewards applied successfully',

      ...data,
    };
  }

  // =======================
  // ❌ REMOVE REWARDS
  // =======================

  @Post(':checkoutSessionId/remove-rewards')
  @UseGuards(JwtAuthGuard)
  async removeRewards(
    @Param('checkoutSessionId')
    checkoutSessionId: string,
  ) {
    const data = await this.removeRewardsFromCheckoutUseCase.execute({
      checkoutSessionId,
    });

    return {
      message: 'Rewards removed successfully',

      ...data,
    };
  }

  // =======================
  // ⏳ EXPIRE CHECKOUT SESSION
  // =======================

  @Post(':checkoutSessionId/expire')
  @UseGuards(JwtAuthGuard)
  async expire(
    @Param('checkoutSessionId')
    checkoutSessionId: string,
  ) {
    const data = await this.expireCheckoutSessionUseCase.execute({
      checkoutSessionId,
    });

    return {
      message: 'Checkout session expired successfully',

      ...data,
    };
  }

  // =======================
  // ✅ COMPLETE CHECKOUT SESSION
  // =======================

  @Post(':checkoutSessionId/complete')
  @UseGuards(JwtAuthGuard)
  async complete(
    @Param('checkoutSessionId')
    checkoutSessionId: string,

    @Query('paymentId')
    paymentId?: string,

    @Query('paymentProvider')
    paymentProvider?: string,
  ) {
    const data = await this.completeCheckoutSessionUseCase.execute({
      checkoutSessionId,

      paymentId,

      paymentProvider,
    });

    return {
      message: 'Checkout session completed successfully',

      ...data,
    };
  }
}

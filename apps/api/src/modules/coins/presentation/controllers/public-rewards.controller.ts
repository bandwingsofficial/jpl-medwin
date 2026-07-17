import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { CurrentUser } from '@/modules/auth/presentation/decorators/current-user.decorator';

import { CalculateEarnedCoinsUseCase } from '../../application/use-cases/rewards/calculate-earned-coins.use-case';
import { ValidateRedemptionUseCase } from '../../application/use-cases/redemption/validate-redemption.use-case';
import { RedeemCoinsUseCase } from '../../application/use-cases/redemption/redeem-coins.use-case';
import { GetRewardConfigUseCase } from '../../application/use-cases/config/get-reward-config.use-case';
import { ListRewardCampaignsUseCase } from '../../application/use-cases/campaigns/list-reward-campaigns.use-case';

import { RedeemCoinsDto } from '../dto/wallet/redeem-coins.dto';

@Controller('rewards')
@UseGuards(JwtAuthGuard)
export class PublicRewardsController {
  constructor(
    private readonly calculateEarnedCoinsUseCase: CalculateEarnedCoinsUseCase,
    private readonly validateRedemptionUseCase: ValidateRedemptionUseCase,
    private readonly redeemCoinsUseCase: RedeemCoinsUseCase,
    private readonly getRewardConfigUseCase: GetRewardConfigUseCase,
    private readonly listRewardCampaignsUseCase: ListRewardCampaignsUseCase,
  ) {}

  @Get('config')
  async getRewardConfig() {
    return this.getRewardConfigUseCase.execute({
      activeOnly: true,
    });
  }

  @Post('calculate-earned-coins')
  async calculateEarnedCoins(
    @Body()
    body: {
      orderAmount: number;
    },
  ) {
    return this.calculateEarnedCoinsUseCase.execute({
      orderAmount: body.orderAmount,
    });
  }

  @Post('validate-redemption')
  async validateRedemption(
    @CurrentUser()
    user: {
      userId: string;
    },

    @Body()
    body: {
      coins: number;
      orderAmount: number;
    },
  ) {
    return this.validateRedemptionUseCase.execute({
      userId: user.userId,
      coins: body.coins,
      orderAmount: body.orderAmount,
    });
  }

  @Post('redeem')
  async redeemCoins(
    @CurrentUser()
    user: {
      userId: string;
    },

    @Body()
    body: RedeemCoinsDto,
  ) {
    return this.redeemCoinsUseCase.execute({
      userId: user.userId,
      orderId: body.orderId,
      coins: body.coins,
      orderAmount: body.orderAmount,
      paymentId: body.paymentId,
      metadata: body.metadata,
    });
  }

  @Get('campaigns')
  async getCampaigns() {
    return this.listRewardCampaignsUseCase.execute({
      currentOnly: true,
    });
  }
}

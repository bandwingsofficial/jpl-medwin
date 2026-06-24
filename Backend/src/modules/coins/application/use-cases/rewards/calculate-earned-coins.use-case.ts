import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';

import { RewardsDomainService } from '../../../domain/services/rewards-domain.service';

import { RewardConfigNotFoundException } from '../../../domain/exceptions/reward-config-not-found.exception';

@Injectable()
export class CalculateEarnedCoinsUseCase {
  constructor(
    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepo: RewardConfigRepository,

    private readonly rewardsDomainService: RewardsDomainService,
  ) {}

  async execute(input: {
    orderAmount: number;
  }) {
    this.rewardsDomainService.validateOrderAmount(
      input.orderAmount,
    );

    const rewardConfig =
      await this.rewardConfigRepo.findActiveConfig();

    if (!rewardConfig) {
      throw new RewardConfigNotFoundException();
    }

    rewardConfig.ensureActive();

    const earnedCoins =
      rewardConfig.calculateEarnedCoins(
        input.orderAmount,
      );

    const earnRate =
      `₹${rewardConfig.earnRateAmount} = ${rewardConfig.earnRateCoins} coins`;

    const estimatedCoinValue =
      rewardConfig.calculateCoinValue(
        earnedCoins,
      );

    const expiresAt =
      rewardConfig.calculateExpiryDate();

    return {
      orderAmount: input.orderAmount,

      earnedCoins,

      estimatedCoinValue,

      earnRate,

      expiresAt,

      config: {
        id: rewardConfig.id,

        earnRateAmount:
          rewardConfig.earnRateAmount,

        earnRateCoins:
          rewardConfig.earnRateCoins,

        coinValue:
          rewardConfig.coinValue,

        maxRedemptionPercentage:
          rewardConfig.maxRedemptionPercentage,

        minimumOrderAmount:
          rewardConfig.minimumOrderAmount,

        expiryMonths:
          rewardConfig.expiryMonths,

        rewardOnDelivered:
          rewardConfig.rewardOnDelivered,

        isActive:
          rewardConfig.isActive,
      },

      summary: {
        coinsPerRate:
          rewardConfig.earnRateCoins,

        amountPerRate:
          rewardConfig.earnRateAmount,

        estimatedSavings:
          estimatedCoinValue,
      },
    };
  }
}
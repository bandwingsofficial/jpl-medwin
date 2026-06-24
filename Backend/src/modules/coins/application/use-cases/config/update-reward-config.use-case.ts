import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

import { TOKENS } from '@/common/constants/tokens';

import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';

import { RewardConfigNotFoundException } from '../../../domain/exceptions/reward-config-not-found.exception';

@Injectable()
export class UpdateRewardConfigUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,
  ) {}

  async execute(input: {
    id: string;
    earnRateAmount?: number;
    earnRateCoins?: number;
    coinValue?: number;
    maxRedemptionPercentage?: number;
    minimumOrderAmount?: number;
    expiryMonths?: number;
    rewardOnDelivered?: boolean;
    isActive?: boolean;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const rewardConfig =
        await this.rewardConfigRepository.findById(
          input.id,
          tx,
        );

      if (!rewardConfig) {
        throw new RewardConfigNotFoundException({
          rewardConfigId: input.id,
        });
      }

      const shouldActivate = input.isActive === true;

      if (shouldActivate) {
        await this.rewardConfigRepository.deactivateAll(
          tx,
        );
      }

      rewardConfig.updateDetails({
        earnRateAmount: input.earnRateAmount,
        earnRateCoins: input.earnRateCoins,
        coinValue: input.coinValue,
        maxRedemptionPercentage:
          input.maxRedemptionPercentage,
        minimumOrderAmount:
          input.minimumOrderAmount,
        expiryMonths: input.expiryMonths,
        rewardOnDelivered:
          input.rewardOnDelivered,
        isActive: input.isActive,
      });

      const updatedConfig =
        await this.rewardConfigRepository.update(
          rewardConfig,
          tx,
        );

      return {
        id: updatedConfig.id,
        earnRateAmount:
          updatedConfig.earnRateAmount,
        earnRateCoins:
          updatedConfig.earnRateCoins,
        coinValue: updatedConfig.coinValue,
        maxRedemptionPercentage:
          updatedConfig.maxRedemptionPercentage,
        minimumOrderAmount:
          updatedConfig.minimumOrderAmount,
        expiryMonths:
          updatedConfig.expiryMonths,
        rewardOnDelivered:
          updatedConfig.rewardOnDelivered,
        isActive: updatedConfig.isActive,
        createdAt: updatedConfig.createdAt,
        updatedAt: updatedConfig.updatedAt,
      };
    });
  }
}
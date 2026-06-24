import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

import { TOKENS } from '@/common/constants/tokens';

import { RewardConfig } from '../../../domain/entities/reward-config.entity';

import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';

@Injectable()
export class CreateRewardConfigUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,
  ) {}

  async execute(input: {
    earnRateAmount: number;
    earnRateCoins: number;
    coinValue: number;
    maxRedemptionPercentage: number;
    minimumOrderAmount?: number;
    expiryMonths?: number;
    rewardOnDelivered?: boolean;
    isActive?: boolean;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const shouldActivate = input.isActive !== false;

      if (shouldActivate) {
        await this.rewardConfigRepository.deactivateAll(tx);
      }

      const rewardConfig = new RewardConfig(
        randomUUID(),
        input.earnRateAmount,
        input.earnRateCoins,
        input.coinValue,
        input.maxRedemptionPercentage,
        input.minimumOrderAmount,
        input.expiryMonths ?? 12,
        input.rewardOnDelivered ?? true,
        shouldActivate,
      );

      const createdConfig =
        await this.rewardConfigRepository.create(
          rewardConfig,
          tx,
        );

      return {
        id: createdConfig.id,
        earnRateAmount: createdConfig.earnRateAmount,
        earnRateCoins: createdConfig.earnRateCoins,
        coinValue: createdConfig.coinValue,
        maxRedemptionPercentage:
          createdConfig.maxRedemptionPercentage,
        minimumOrderAmount:
          createdConfig.minimumOrderAmount,
        expiryMonths: createdConfig.expiryMonths,
        rewardOnDelivered:
          createdConfig.rewardOnDelivered,
        isActive: createdConfig.isActive,
        createdAt: createdConfig.createdAt,
        updatedAt: createdConfig.updatedAt,
      };
    });
  }
}
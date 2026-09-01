import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';

import { RewardConfig } from '../../../domain/entities/reward-config.entity';

import { RewardConfigNotFoundException } from '../../../domain/exceptions/reward-config-not-found.exception';

@Injectable()
export class GetRewardConfigUseCase {
  constructor(
    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,
  ) {}

  async execute(input?: { id?: string; activeOnly?: boolean }) {
    if (input?.id) {
      const rewardConfig = await this.rewardConfigRepository.findById(input.id);

      if (!rewardConfig) {
        throw new RewardConfigNotFoundException({
          rewardConfigId: input.id,
        });
      }

      return this.toResponse(rewardConfig);
    }

    if (input?.activeOnly !== false) {
      const activeConfig = await this.rewardConfigRepository.findActiveConfig();

      if (!activeConfig) {
        throw new RewardConfigNotFoundException();
      }

      return this.toResponse(activeConfig);
    }

    const latestConfig = await this.rewardConfigRepository.findLatest();

    if (!latestConfig) {
      throw new RewardConfigNotFoundException();
    }

    return this.toResponse(latestConfig);
  }

  private toResponse(rewardConfig: RewardConfig) {
    return {
      id: rewardConfig.id,
      earnRateAmount: rewardConfig.earnRateAmount,
      earnRateCoins: rewardConfig.earnRateCoins,
      coinValue: rewardConfig.coinValue,
      maxRedemptionPercentage: rewardConfig.maxRedemptionPercentage,
      minimumOrderAmount: rewardConfig.minimumOrderAmount,
      expiryMonths: rewardConfig.expiryMonths,
      rewardOnDelivered: rewardConfig.rewardOnDelivered,
      isActive: rewardConfig.isActive,
      createdAt: rewardConfig.createdAt,
      updatedAt: rewardConfig.updatedAt,
    };
  }
}

import { Injectable } from '@nestjs/common';

import { RewardCampaign } from '../entities/reward-campaign.entity';
import { RewardConfig } from '../entities/reward-config.entity';
import { RewardTier } from '../entities/reward-tier.entity';

import { InactiveRewardConfigException } from '../exceptions/inactive-reward-config.exception';
import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';

@Injectable()
export class RewardsDomainService {
  calculateBaseCoins(params: { orderAmount: number; rewardConfig: RewardConfig }): number {
    const { orderAmount, rewardConfig } = params;

    this.validateOrderAmount(orderAmount);

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateEarnedCoins(orderAmount);
  }

  applyTierMultiplier(params: { baseCoins: number; rewardTier?: RewardTier | null }): number {
    const { baseCoins, rewardTier } = params;

    if (!Number.isInteger(baseCoins) || baseCoins <= 0) {
      return 0;
    }

    if (!rewardTier || rewardTier.isInactive()) {
      return baseCoins;
    }

    return rewardTier.calculateRewardCoins(baseCoins);
  }

  applyCampaignBonus(params: { coins: number; campaign?: RewardCampaign | null }): number {
    const { coins, campaign } = params;

    if (!Number.isInteger(coins) || coins <= 0) {
      return 0;
    }

    if (!campaign || !campaign.isCurrentlyActive()) {
      return coins;
    }

    return campaign.calculateBonusCoins(coins);
  }

  calculateFinalRewardCoins(params: {
    orderAmount: number;
    rewardConfig: RewardConfig;
    rewardTier?: RewardTier | null;
    campaign?: RewardCampaign | null;
  }): number {
    const { orderAmount, rewardConfig, rewardTier, campaign } = params;

    const baseCoins = this.calculateBaseCoins({
      orderAmount,
      rewardConfig,
    });

    const tierCoins = this.applyTierMultiplier({
      baseCoins,
      rewardTier,
    });

    return this.applyCampaignBonus({
      coins: tierCoins,
      campaign,
    });
  }

  validateTierEligibility(params: { rewardTier: RewardTier; lifetimeSpend: number }) {
    const { rewardTier, lifetimeSpend } = params;

    if (
      !rewardTier.isEligible({
        lifetimeSpend,
      })
    ) {
      throw new InvalidCoinTransactionException({
        message: `User is not eligible for ${rewardTier.name} tier`,
      });
    }
  }

  validateOrderAmount(orderAmount: number) {
    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Order amount must be greater than zero',
      });
    }
  }

  ensureRewardConfigActive(rewardConfig: RewardConfig) {
    if (rewardConfig.isInactive()) {
      throw new InactiveRewardConfigException({
        rewardConfigId: rewardConfig.id,
      });
    }
  }
}

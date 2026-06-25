import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardTier } from '../../../domain/entities/reward-tier.entity';

import { RewardTierRepository } from '../../../domain/repositories/reward-tier.repository';

import { RewardsDomainService } from '../../../domain/services/rewards-domain.service';

import { RewardTierNotFoundException } from '../../../domain/exceptions/reward-tier-not-found.exception';

@Injectable()
export class ApplyRewardTierUseCase {
  constructor(
    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepo: RewardTierRepository,

    private readonly rewardsDomainService: RewardsDomainService,
  ) {}

  async execute(input: { tierId: string; baseCoins: number; lifetimeSpend: number }) {
    const rewardTier: RewardTier | null = await this.rewardTierRepo.findById(input.tierId);

    if (!rewardTier) {
      throw new RewardTierNotFoundException({
        rewardTierId: input.tierId,
      });
    }

    this.rewardsDomainService.validateTierEligibility({
      rewardTier,
      lifetimeSpend: input.lifetimeSpend,
    });

    const finalCoins = this.rewardsDomainService.applyTierMultiplier({
      baseCoins: input.baseCoins,
      rewardTier,
    });

    const bonusCoins = finalCoins - input.baseCoins;

    return {
      tier: {
        id: rewardTier.id,

        name: rewardTier.name,

        description: rewardTier.description,

        status: rewardTier.status,

        coinMultiplier: rewardTier.coinMultiplier,

        minimumLifetimeSpend: rewardTier.minimumLifetimeSpend,

        badgeImage: rewardTier.badgeImage,

        isActive: rewardTier.isActive(),
      },

      rewards: {
        baseCoins: input.baseCoins,

        finalCoins,

        bonusCoins,

        multiplier: rewardTier.coinMultiplier,
      },

      eligibility: {
        eligible: true,

        lifetimeSpend: input.lifetimeSpend,

        minimumRequiredSpend: rewardTier.minimumLifetimeSpend,
      },
    };
  }
}

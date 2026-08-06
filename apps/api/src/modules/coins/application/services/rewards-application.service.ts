import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardsDomainService } from '../../domain/services/rewards-domain.service';

import { RewardCampaignRepository } from '../../domain/repositories/reward-campaign.repository';
import { RewardConfigRepository } from '../../domain/repositories/reward-config.repository';
import { RewardTierRepository } from '../../domain/repositories/reward-tier.repository';

import { RewardCampaign } from '../../domain/entities/reward-campaign.entity';
import { RewardTier } from '../../domain/entities/reward-tier.entity';

import { RewardConfigNotFoundException } from '../../domain/exceptions/reward-config-not-found.exception';
import { RewardTierNotFoundException } from '../../domain/exceptions/reward-tier-not-found.exception';

@Injectable()
export class RewardsApplicationService {
  constructor(
    private readonly rewardsDomainService: RewardsDomainService,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,

    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepository: RewardTierRepository,

    @Inject(TOKENS.REWARD_CAMPAIGN_REPO)
    private readonly rewardCampaignRepository: RewardCampaignRepository,
  ) {}

  async calculateRewardCoins(params: {
    orderAmount: number;
    lifetimeSpend?: number;
    tierId?: string;
    userId?: string;
  }) {
    const { orderAmount, lifetimeSpend, tierId } = params;

    const rewardConfig = await this.rewardConfigRepository.findActiveConfig();

    if (!rewardConfig) {
      throw new RewardConfigNotFoundException();
    }

    rewardConfig.ensureActive();

    let rewardTier: RewardTier | null = null;

    if (tierId) {
      rewardTier = await this.rewardTierRepository.findById(tierId);

      if (!rewardTier) {
        throw new RewardTierNotFoundException({
          rewardTierId: tierId,
        });
      }
    } else if (lifetimeSpend !== undefined) {
      rewardTier = await this.rewardTierRepository.findEligibleTier({
        lifetimeSpend,
      });
    }

    const activeCampaign = await this.getHighestPriorityCampaign();

    return this.rewardsDomainService.calculateFinalRewardCoins({
      orderAmount,
      rewardConfig,
      rewardTier,
      campaign: activeCampaign,
    });
  }

  async getHighestPriorityCampaign(): Promise<RewardCampaign | null> {
    const campaigns = await this.rewardCampaignRepository.findCurrentCampaigns();

    if (campaigns.length === 0) {
      return null;
    }

    return campaigns.sort((a, b) => b.bonusMultiplier - a.bonusMultiplier)[0];
  }

  async getActiveCampaigns() {
    return this.rewardCampaignRepository.findCurrentCampaigns();
  }

  async getActiveRewardTiers() {
    return this.rewardTierRepository.findActiveTiers();
  }

  async getEligibleRewardTier(lifetimeSpend: number) {
    return this.rewardTierRepository.findEligibleTier({
      lifetimeSpend,
    });
  }
}

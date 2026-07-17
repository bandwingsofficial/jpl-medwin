import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardCampaign } from '../../../domain/entities/reward-campaign.entity';

import { RewardCampaignRepository } from '../../../domain/repositories/reward-campaign.repository';

@Injectable()
export class ListRewardCampaignsUseCase {
  constructor(
    @Inject(TOKENS.REWARD_CAMPAIGN_REPO)
    private readonly rewardCampaignRepo: RewardCampaignRepository,
  ) {}

  async execute(input?: {
    activeOnly?: boolean;
    currentOnly?: boolean;
    expiredOnly?: boolean;
    upcomingOnly?: boolean;
  }) {
    let campaigns: RewardCampaign[] = [];

    if (input?.activeOnly) {
      campaigns = await this.rewardCampaignRepo.findActiveCampaigns();
    } else if (input?.currentOnly) {
      campaigns = await this.rewardCampaignRepo.findCurrentCampaigns();
    } else if (input?.expiredOnly) {
      campaigns = await this.rewardCampaignRepo.findExpiredCampaigns();
    } else if (input?.upcomingOnly) {
      campaigns = await this.rewardCampaignRepo.findUpcomingCampaigns();
    } else {
      campaigns = await this.rewardCampaignRepo.findAll();
    }

    return this.formatResponse(campaigns);
  }

  private formatResponse(campaigns: RewardCampaign[]) {
    return campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      bonusMultiplier: campaign.bonusMultiplier,
      startsAt: campaign.startsAt,
      endsAt: campaign.endsAt,
      isActive: campaign.isActive,
      isCurrentlyActive: campaign.isCurrentlyActive(),
      isExpired: campaign.isExpired(),
      isUpcoming: campaign.isUpcoming(),
      metadata: campaign.metadata,
      createdAt: campaign.createdAt,
    }));
  }
}

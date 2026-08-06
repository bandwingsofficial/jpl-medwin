import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardCampaign } from '../../../domain/entities/reward-campaign.entity';

import { RewardCampaignRepository } from '../../../domain/repositories/reward-campaign.repository';

import { InvalidRedemptionException } from '../../../domain/exceptions/invalid-redemption.exception';

@Injectable()
export class UpdateRewardCampaignUseCase {
  constructor(
    @Inject(TOKENS.REWARD_CAMPAIGN_REPO)
    private readonly rewardCampaignRepo: RewardCampaignRepository,
  ) {}

  async execute(input: {
    id: string;
    title?: string;
    description?: string;
    bonusMultiplier?: number;
    startsAt?: Date;
    endsAt?: Date;
    isActive?: boolean;
    metadata?: Record<string, unknown>;
  }) {
    const campaign: RewardCampaign | null = await this.rewardCampaignRepo.findById(input.id);

    if (!campaign) {
      throw new InvalidRedemptionException({
        message: 'Reward campaign not found',
      });
    }

    campaign.updateDetails({
      title: input.title,
      description: input.description,
      bonusMultiplier: input.bonusMultiplier,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      isActive: input.isActive,
      metadata: input.metadata,
    });

    campaign.validate();

    const updated = await this.rewardCampaignRepo.update(campaign);

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      bonusMultiplier: updated.bonusMultiplier,
      startsAt: updated.startsAt,
      endsAt: updated.endsAt,
      isActive: updated.isActive,
      isCurrentlyActive: updated.isCurrentlyActive(),
      isExpired: updated.isExpired(),
      isUpcoming: updated.isUpcoming(),
      metadata: updated.metadata,
      createdAt: updated.createdAt,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { RewardCampaign } from '../../../domain/entities/reward-campaign.entity';

import { RewardCampaignRepository } from '../../../domain/repositories/reward-campaign.repository';

@Injectable()
export class CreateRewardCampaignUseCase {
  constructor(
    @Inject(TOKENS.REWARD_CAMPAIGN_REPO)
    private readonly rewardCampaignRepo: RewardCampaignRepository,
  ) {}

  async execute(input: {
    title: string;
    bonusMultiplier: number;
    startsAt: Date;
    endsAt: Date;
    isActive?: boolean;
    description?: string;
    metadata?: Record<string, unknown>;
  }) {
    const campaign = new RewardCampaign(
      randomUUID(),
      input.title,
      input.bonusMultiplier,
      new Date(input.startsAt),
      new Date(input.endsAt),
      input.isActive ?? true,
      input.description,
      input.metadata,
    );

    campaign.validate();

    const created = await this.rewardCampaignRepo.create(campaign);

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      bonusMultiplier: created.bonusMultiplier,
      startsAt: created.startsAt,
      endsAt: created.endsAt,
      isActive: created.isActive,
      isCurrentlyActive: created.isCurrentlyActive(),
      isExpired: created.isExpired(),
      isUpcoming: created.isUpcoming(),
      metadata: created.metadata,
      createdAt: created.createdAt,
    };
  }
}

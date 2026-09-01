import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardTier } from '../../../domain/entities/reward-tier.entity';

import { RewardTierRepository } from '../../../domain/repositories/reward-tier.repository';

import { RewardTierStatus } from '../../../domain/enums/reward-tier-status.enum';

@Injectable()
export class ListTiersUseCase {
  constructor(
    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepo: RewardTierRepository,
  ) {}

  async execute(input?: { status?: RewardTierStatus; activeOnly?: boolean }) {
    let tiers: RewardTier[] = [];

    if (input?.activeOnly) {
      tiers = await this.rewardTierRepo.findActiveTiers();
    } else if (input?.status) {
      tiers = await this.rewardTierRepo.findByStatus(input.status);
    } else {
      tiers = await this.rewardTierRepo.findAll();
    }

    return this.formatResponse(tiers);
  }

  private formatResponse(tiers: RewardTier[]) {
    return tiers.map((tier) => ({
      id: tier.id,
      name: tier.name,
      description: tier.description,
      status: tier.status,
      coinMultiplier: tier.coinMultiplier,
      minimumLifetimeSpend: tier.minimumLifetimeSpend,
      badgeImage: tier.badgeImage,
      isActive: tier.isActive(),
      createdAt: tier.createdAt,
      updatedAt: tier.updatedAt,
    }));
  }
}

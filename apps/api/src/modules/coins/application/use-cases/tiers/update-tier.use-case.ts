import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardTier } from '../../../domain/entities/reward-tier.entity';

import { RewardTierRepository } from '../../../domain/repositories/reward-tier.repository';

import { RewardTierStatus } from '../../../domain/enums/reward-tier-status.enum';

import { RewardTierNotFoundException } from '../../../domain/exceptions/reward-tier-not-found.exception';

import { InvalidCoinTransactionException } from '../../../domain/exceptions/invalid-coin-transaction.exception';

@Injectable()
export class UpdateTierUseCase {
  constructor(
    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepo: RewardTierRepository,
  ) {}

  async execute(input: {
    id: string;
    name?: string;
    description?: string;
    coinMultiplier?: number;
    minimumLifetimeSpend?: number;
    badgeImage?: string;
    status?: RewardTierStatus;
  }) {
    const tier: RewardTier | null = await this.rewardTierRepo.findById(input.id);

    if (!tier) {
      throw new RewardTierNotFoundException({
        rewardTierId: input.id,
      });
    }

    if (input.name && input.name !== tier.name) {
      const existing = await this.rewardTierRepo.findByName(input.name);

      if (existing && existing.id !== tier.id) {
        throw new InvalidCoinTransactionException({
          message: 'Reward tier name already exists',
        });
      }
    }

    tier.updateDetails({
      name: input.name,
      description: input.description,
      status: input.status,
      coinMultiplier: input.coinMultiplier,
      minimumLifetimeSpend: input.minimumLifetimeSpend,
      badgeImage: input.badgeImage,
    });

    const updated = await this.rewardTierRepo.update(tier);

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      status: updated.status,
      coinMultiplier: updated.coinMultiplier,
      minimumLifetimeSpend: updated.minimumLifetimeSpend,
      badgeImage: updated.badgeImage,
      isActive: updated.isActive(),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}

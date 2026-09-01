import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { RewardTier } from '../../../domain/entities/reward-tier.entity';

import { RewardTierRepository } from '../../../domain/repositories/reward-tier.repository';

import { RewardTierStatus } from '../../../domain/enums/reward-tier-status.enum';

import { InvalidCoinTransactionException } from '../../../domain/exceptions/invalid-coin-transaction.exception';

@Injectable()
export class CreateTierUseCase {
  constructor(
    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepo: RewardTierRepository,
  ) {}

  async execute(input: {
    name: string;
    description?: string;
    coinMultiplier: number;
    minimumLifetimeSpend: number;
    badgeImage?: string;
    status?: RewardTierStatus;
  }) {
    const existing = await this.rewardTierRepo.findByName(input.name);

    if (existing) {
      throw new InvalidCoinTransactionException({
        message: 'Reward tier already exists',
      });
    }

    const tier = new RewardTier(
      randomUUID(),
      input.name,
      input.status ?? RewardTierStatus.ACTIVE,
      input.coinMultiplier,
      input.minimumLifetimeSpend,
      input.description,
      input.badgeImage,
    );

    tier.validate();

    const created = await this.rewardTierRepo.create(tier);

    return {
      id: created.id,
      name: created.name,
      description: created.description,
      status: created.status,
      coinMultiplier: created.coinMultiplier,
      minimumLifetimeSpend: created.minimumLifetimeSpend,
      badgeImage: created.badgeImage,
      isActive: created.isActive(),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }
}

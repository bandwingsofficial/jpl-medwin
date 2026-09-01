import { Prisma } from '@prisma/client';

import { RewardTier } from '../entities/reward-tier.entity';

import { RewardTierStatus } from '../enums/reward-tier-status.enum';

export interface RewardTierRepository {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<RewardTier | null>;

  findByName(name: string, tx?: Prisma.TransactionClient): Promise<RewardTier | null>;

  findAll(tx?: Prisma.TransactionClient): Promise<RewardTier[]>;

  findByStatus(status: RewardTierStatus, tx?: Prisma.TransactionClient): Promise<RewardTier[]>;

  findActiveTiers(tx?: Prisma.TransactionClient): Promise<RewardTier[]>;

  findEligibleTier(
    params: {
      lifetimeSpend: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<RewardTier | null>;

  findHighestEligibleTier(
    params: {
      lifetimeSpend: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<RewardTier | null>;

  existsById(id: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  existsByName(name: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  create(tier: RewardTier, tx?: Prisma.TransactionClient): Promise<RewardTier>;

  update(tier: RewardTier, tx?: Prisma.TransactionClient): Promise<RewardTier>;

  activate(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  deactivate(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

import { Prisma } from '@prisma/client';

import { RewardConfig } from '../entities/reward-config.entity';

export interface RewardConfigRepository {
  findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<RewardConfig | null>;

  findActiveConfig(
    tx?: Prisma.TransactionClient,
  ): Promise<RewardConfig | null>;

  findAll(
    tx?: Prisma.TransactionClient,
  ): Promise<RewardConfig[]>;

  findLatest(
    tx?: Prisma.TransactionClient,
  ): Promise<RewardConfig | null>;

  existsById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  existsActiveConfig(
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  create(
    config: RewardConfig,
    tx?: Prisma.TransactionClient,
  ): Promise<RewardConfig>;

  update(
    config: RewardConfig,
    tx?: Prisma.TransactionClient,
  ): Promise<RewardConfig>;

  activate(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  deactivate(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  deactivateAll(
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  delete(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;
}
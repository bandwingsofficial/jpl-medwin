import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient, RewardTierStatus as PrismaRewardTierStatus } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { RewardTierRepository } from '../../../../domain/repositories/reward-tier.repository';

import { RewardTier } from '../../../../domain/entities/reward-tier.entity';

import { RewardTierStatus } from '../../../../domain/enums/reward-tier-status.enum';

import { RewardTierMapper } from '../mappers/reward-tier.mapper';

@Injectable()
export class PrismaRewardTierRepository implements RewardTierRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier | null> {
    const tier = await tx.rewardTier.findUnique({
      where: { id },
    });

    return tier ? RewardTierMapper.toDomain(tier) : null;
  }

  async findByName(
    name: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier | null> {
    const tier = await tx.rewardTier.findFirst({
      where: { name },
    });

    return tier ? RewardTierMapper.toDomain(tier) : null;
  }

  async findAll(tx: Prisma.TransactionClient | PrismaClient = this.prisma): Promise<RewardTier[]> {
    const tiers = await tx.rewardTier.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tiers.map((tier) => RewardTierMapper.toDomain(tier));
  }

  async findByStatus(
    status: RewardTierStatus,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier[]> {
    const tiers = await tx.rewardTier.findMany({
      where: {
        status: PrismaRewardTierStatus[status],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return tiers.map((tier) => RewardTierMapper.toDomain(tier));
  }

  async findActiveTiers(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier[]> {
    const tiers = await tx.rewardTier.findMany({
      where: {
        status: PrismaRewardTierStatus.ACTIVE,
      },
      orderBy: {
        minimumLifetimeSpend: 'asc',
      },
    });

    return tiers.map((tier) => RewardTierMapper.toDomain(tier));
  }

  async findEligibleTier(
    params: {
      lifetimeSpend: number;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier | null> {
    const { lifetimeSpend } = params;

    const tier = await tx.rewardTier.findFirst({
      where: {
        status: PrismaRewardTierStatus.ACTIVE,
        minimumLifetimeSpend: {
          lte: lifetimeSpend,
        },
      },
      orderBy: {
        minimumLifetimeSpend: 'desc',
      },
    });

    return tier ? RewardTierMapper.toDomain(tier) : null;
  }

  async findHighestEligibleTier(
    params: {
      lifetimeSpend: number;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier | null> {
    const { lifetimeSpend } = params;

    const tier = await tx.rewardTier.findFirst({
      where: {
        status: PrismaRewardTierStatus.ACTIVE,
        minimumLifetimeSpend: {
          lte: lifetimeSpend,
        },
      },
      orderBy: {
        coinMultiplier: 'desc',
      },
    });

    return tier ? RewardTierMapper.toDomain(tier) : null;
  }

  async existsById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.rewardTier.count({
      where: { id },
    });

    return count > 0;
  }

  async existsByName(
    name: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.rewardTier.count({
      where: { name },
    });

    return count > 0;
  }

  async create(
    tier: RewardTier,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier> {
    const createdTier = await tx.rewardTier.create({
      data: RewardTierMapper.toPersistence(tier),
    });

    return RewardTierMapper.toDomain(createdTier);
  }

  async update(
    tier: RewardTier,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardTier> {
    const updatedTier = await tx.rewardTier.update({
      where: {
        id: tier.id,
      },
      data: RewardTierMapper.toPersistence(tier),
    });

    return RewardTierMapper.toDomain(updatedTier);
  }

  async activate(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardTier.update({
      where: { id },
      data: {
        status: PrismaRewardTierStatus.ACTIVE,
      },
    });
  }

  async deactivate(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardTier.update({
      where: { id },
      data: {
        status: PrismaRewardTierStatus.INACTIVE,
      },
    });
  }

  async delete(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardTier.delete({
      where: { id },
    });
  }
}

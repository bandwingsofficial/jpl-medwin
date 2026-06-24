import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { RewardConfigRepository } from '../../../../domain/repositories/reward-config.repository';

import { RewardConfig } from '../../../../domain/entities/reward-config.entity';

import { RewardConfigMapper } from '../mappers/reward-config.mapper';

@Injectable()
export class PrismaRewardConfigRepository implements RewardConfigRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardConfig | null> {
    const config = await tx.rewardConfig.findUnique({
      where: { id },
    });

    return config ? RewardConfigMapper.toDomain(config) : null;
  }

  async findActiveConfig(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardConfig | null> {
    const config = await tx.rewardConfig.findFirst({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return config ? RewardConfigMapper.toDomain(config) : null;
  }

  async findLatest(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardConfig | null> {
    const config = await tx.rewardConfig.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return config ? RewardConfigMapper.toDomain(config) : null;
  }

  async findAll(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardConfig[]> {
    const configs = await tx.rewardConfig.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return configs.map((config) => RewardConfigMapper.toDomain(config));
  }

  async existsById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.rewardConfig.count({
      where: { id },
    });

    return count > 0;
  }

  async existsActiveConfig(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.rewardConfig.count({
      where: {
        isActive: true,
      },
    });

    return count > 0;
  }

  async create(
    config: RewardConfig,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardConfig> {
    const createdConfig = await tx.rewardConfig.create({
      data: RewardConfigMapper.toPersistence(config),
    });

    return RewardConfigMapper.toDomain(createdConfig);
  }

  async update(
    config: RewardConfig,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardConfig> {
    const updatedConfig = await tx.rewardConfig.update({
      where: {
        id: config.id,
      },
      data: RewardConfigMapper.toPersistence(config),
    });

    return RewardConfigMapper.toDomain(updatedConfig);
  }

  async activate(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardConfig.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  async deactivate(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardConfig.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async deactivateAll(tx: Prisma.TransactionClient | PrismaClient = this.prisma): Promise<void> {
    await tx.rewardConfig.updateMany({
      where: {
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  async delete(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardConfig.delete({
      where: { id },
    });
  }
}

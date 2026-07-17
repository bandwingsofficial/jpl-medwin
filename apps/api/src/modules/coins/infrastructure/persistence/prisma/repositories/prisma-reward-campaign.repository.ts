import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { RewardCampaignRepository } from '../../../../domain/repositories/reward-campaign.repository';

import { RewardCampaign } from '../../../../domain/entities/reward-campaign.entity';

import { RewardCampaignMapper } from '../mappers/reward-campaign.mapper';

@Injectable()
export class PrismaRewardCampaignRepository implements RewardCampaignRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign | null> {
    const campaign = await tx.rewardCampaign.findUnique({
      where: { id },
    });

    return campaign ? RewardCampaignMapper.toDomain(campaign) : null;
  }

  async findAll(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign[]> {
    const campaigns = await tx.rewardCampaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns.map((campaign) => RewardCampaignMapper.toDomain(campaign));
  }

  async findLatest(
    limit: number = 10,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign[]> {
    const campaigns = await tx.rewardCampaign.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return campaigns.map((campaign) => RewardCampaignMapper.toDomain(campaign));
  }

  async findActiveCampaigns(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign[]> {
    const campaigns = await tx.rewardCampaign.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return campaigns.map((campaign) => RewardCampaignMapper.toDomain(campaign));
  }

  async findCurrentCampaigns(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign[]> {
    const now = new Date();

    const campaigns = await tx.rewardCampaign.findMany({
      where: {
        isActive: true,
        startsAt: {
          lte: now,
        },
        endsAt: {
          gte: now,
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    });

    return campaigns.map((campaign) => RewardCampaignMapper.toDomain(campaign));
  }

  async findExpiredCampaigns(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign[]> {
    const now = new Date();

    const campaigns = await tx.rewardCampaign.findMany({
      where: {
        endsAt: {
          lt: now,
        },
      },
      orderBy: {
        endsAt: 'desc',
      },
    });

    return campaigns.map((campaign) => RewardCampaignMapper.toDomain(campaign));
  }

  async findUpcomingCampaigns(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign[]> {
    const now = new Date();

    const campaigns = await tx.rewardCampaign.findMany({
      where: {
        startsAt: {
          gt: now,
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
    });

    return campaigns.map((campaign) => RewardCampaignMapper.toDomain(campaign));
  }

  async existsById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.rewardCampaign.count({
      where: { id },
    });

    return count > 0;
  }

  async create(
    campaign: RewardCampaign,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign> {
    const createdCampaign = await tx.rewardCampaign.create({
      data: RewardCampaignMapper.toPersistence(campaign),
    });

    return RewardCampaignMapper.toDomain(createdCampaign);
  }

  async update(
    campaign: RewardCampaign,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<RewardCampaign> {
    const updatedCampaign = await tx.rewardCampaign.update({
      where: {
        id: campaign.id,
      },
      data: RewardCampaignMapper.toPersistence(campaign),
    });

    return RewardCampaignMapper.toDomain(updatedCampaign);
  }

  async activate(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardCampaign.update({
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
    await tx.rewardCampaign.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async delete(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.rewardCampaign.delete({
      where: { id },
    });
  }
}

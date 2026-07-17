import { Injectable } from '@nestjs/common';

import {
  Prisma,
  PrismaClient,
  CoinRedemptionStatus as PrismaCoinRedemptionStatus,
} from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CoinRedemptionRepository } from '../../../../domain/repositories/coin-redemption.repository';

import { CoinRedemption } from '../../../../domain/entities/coin-redemption.entity';

import { CoinRedemptionStatus } from '../../../../domain/enums/coin-redemption-status.enum';

import { CoinRedemptionMapper } from '../mappers/coin-redemption.mapper';

@Injectable()
export class PrismaCoinRedemptionRepository implements CoinRedemptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption | null> {
    const redemption = await tx.coinRedemption.findUnique({
      where: { id },
    });

    return redemption ? CoinRedemptionMapper.toDomain(redemption) : null;
  }

  async findByOrderId(
    orderId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption | null> {
    const redemption = await tx.coinRedemption.findUnique({
      where: { orderId },
    });

    return redemption ? CoinRedemptionMapper.toDomain(redemption) : null;
  }

  async findByUserId(
    userId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption[]> {
    const redemptions = await tx.coinRedemption.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return redemptions.map((redemption) => CoinRedemptionMapper.toDomain(redemption));
  }

  async findByWalletId(
    walletId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption[]> {
    const redemptions = await tx.coinRedemption.findMany({
      where: {
        walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return redemptions.map((redemption) => CoinRedemptionMapper.toDomain(redemption));
  }

  async findByStatus(
    status: CoinRedemptionStatus,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption[]> {
    const redemptions = await tx.coinRedemption.findMany({
      where: {
        status: PrismaCoinRedemptionStatus[status],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return redemptions.map((redemption) => CoinRedemptionMapper.toDomain(redemption));
  }

  async findLatestByUserId(
    userId: string,
    limit: number = 10,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption[]> {
    const redemptions = await tx.coinRedemption.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return redemptions.map((redemption) => CoinRedemptionMapper.toDomain(redemption));
  }

  async findAll(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption[]> {
    const redemptions = await tx.coinRedemption.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return redemptions.map((redemption) => CoinRedemptionMapper.toDomain(redemption));
  }

  async existsById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.coinRedemption.count({
      where: { id },
    });

    return count > 0;
  }

  async existsByOrderId(
    orderId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.coinRedemption.count({
      where: { orderId },
    });

    return count > 0;
  }

  async create(
    redemption: CoinRedemption,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption> {
    const createdRedemption = await tx.coinRedemption.create({
      data: CoinRedemptionMapper.toPersistence(redemption),
    });

    return CoinRedemptionMapper.toDomain(createdRedemption);
  }

  async update(
    redemption: CoinRedemption,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinRedemption> {
    const updatedRedemption = await tx.coinRedemption.update({
      where: {
        id: redemption.id,
      },
      data: CoinRedemptionMapper.toPersistence(redemption),
    });

    return CoinRedemptionMapper.toDomain(updatedRedemption);
  }

  async markAsApplied(
    redemptionId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.coinRedemption.update({
      where: {
        id: redemptionId,
      },
      data: {
        status: PrismaCoinRedemptionStatus.APPLIED,
      },
    });
  }

  async markAsFailed(
    redemptionId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.coinRedemption.update({
      where: {
        id: redemptionId,
      },
      data: {
        status: PrismaCoinRedemptionStatus.FAILED,
      },
    });
  }

  async markAsReversed(
    params: {
      redemptionId: string;
      reversalReason?: string;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    const { redemptionId, reversalReason } = params;

    await tx.coinRedemption.update({
      where: {
        id: redemptionId,
      },
      data: {
        status: PrismaCoinRedemptionStatus.REVERSED,
        reversedAt: new Date(),
        reversalReason: reversalReason ?? null,
      },
    });
  }

  async delete(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.coinRedemption.delete({
      where: { id },
    });
  }
}

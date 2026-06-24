import { Prisma } from '@prisma/client';

import { CoinRedemption } from '../entities/coin-redemption.entity';

import { CoinRedemptionStatus } from '../enums/coin-redemption-status.enum';

export interface CoinRedemptionRepository {
  findById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption | null>;

  findByOrderId(
    orderId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption | null>;

  findByUserId(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption[]>;

  findByWalletId(
    walletId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption[]>;

  findByStatus(
    status: CoinRedemptionStatus,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption[]>;

  findLatestByUserId(
    userId: string,
    limit?: number,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption[]>;

  findAll(
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption[]>;

  existsById(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  existsByOrderId(
    orderId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  create(
    redemption: CoinRedemption,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption>;

  update(
    redemption: CoinRedemption,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinRedemption>;

  markAsApplied(
    redemptionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  markAsFailed(
    redemptionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  markAsReversed(
    params: {
      redemptionId: string;
      reversalReason?: string;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  delete(
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;
}
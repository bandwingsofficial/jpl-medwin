import { Injectable } from '@nestjs/common';

import {
  Prisma,
  PrismaClient,
  CoinTransactionStatus as PrismaCoinTransactionStatus,
  CoinTransactionType as PrismaCoinTransactionType,
  RewardSourceType as PrismaRewardSourceType,
} from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CoinTransactionRepository } from '../../../../domain/repositories/coin-transaction.repository';

import { CoinTransaction } from '../../../../domain/entities/coin-transaction.entity';

import { CoinTransactionStatus } from '../../../../domain/enums/coin-transaction-status.enum';
import { CoinTransactionType } from '../../../../domain/enums/coin-transaction-type.enum';
import { RewardSourceType } from '../../../../domain/enums/reward-source-type.enum';

import { CoinTransactionMapper } from '../mappers/coin-transaction.mapper';

@Injectable()
export class PrismaCoinTransactionRepository implements CoinTransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction | null> {
    const transaction = await tx.coinTransaction.findUnique({
      where: { id },
    });

    return transaction ? CoinTransactionMapper.toDomain(transaction) : null;
  }

  async findAll(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByWalletId(
    walletId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByUserId(
    userId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findLatestByWalletId(
    walletId: string,
    limit: number = 10,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        walletId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findLatestByUserId(
    userId: string,
    limit: number = 10,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findPendingTransactions(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        status: PrismaCoinTransactionStatus.PENDING,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByOrderId(
    orderId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        orderId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByPaymentId(
    paymentId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        paymentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByRedemptionId(
    redemptionId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        redemptionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByType(
    type: CoinTransactionType,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        type: PrismaCoinTransactionType[type],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByStatus(
    status: CoinTransactionStatus,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        status: PrismaCoinTransactionStatus[status],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findBySourceType(
    sourceType: RewardSourceType,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        sourceType: PrismaRewardSourceType[sourceType],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findByIdempotencyKey(
    idempotencyKey: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction | null> {
    const transaction = await tx.coinTransaction.findUnique({
      where: {
        idempotencyKey,
      },
    });

    return transaction ? CoinTransactionMapper.toDomain(transaction) : null;
  }

  async findExpiredTransactions(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        expiredAt: null,
        remainingCoins: {
          gt: 0,
        },
        status: PrismaCoinTransactionStatus.SUCCESS,
        type: {
          in: [
            PrismaCoinTransactionType.EARNED,
            PrismaCoinTransactionType.BONUS,
            PrismaCoinTransactionType.REFUNDED,
            PrismaCoinTransactionType.REDEEM_REVERSED,
            PrismaCoinTransactionType.ADMIN_CREDIT,
          ],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async findExpirableEarnTransactions(
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction[]> {
    const transactions = await tx.coinTransaction.findMany({
      where: {
        status: PrismaCoinTransactionStatus.SUCCESS,
        expiresAt: {
          not: null,
        },
        remainingCoins: {
          gt: 0,
        },
        type: {
          in: [
            PrismaCoinTransactionType.EARNED,
            PrismaCoinTransactionType.BONUS,
            PrismaCoinTransactionType.REFUNDED,
            PrismaCoinTransactionType.REDEEM_REVERSED,
            PrismaCoinTransactionType.ADMIN_CREDIT,
          ],
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return transactions.map((transaction) => CoinTransactionMapper.toDomain(transaction));
  }

  async existsById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.coinTransaction.count({
      where: { id },
    });

    return count > 0;
  }

  async existsByIdempotencyKey(
    idempotencyKey: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.coinTransaction.count({
      where: {
        idempotencyKey,
      },
    });

    return count > 0;
  }

  async create(
    transaction: CoinTransaction,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction> {
    const createdTransaction = await tx.coinTransaction.create({
      data: CoinTransactionMapper.toPersistence(transaction),
    });

    return CoinTransactionMapper.toDomain(createdTransaction);
  }

  async update(
    transaction: CoinTransaction,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinTransaction> {
    const updatedTransaction = await tx.coinTransaction.update({
      where: {
        id: transaction.id,
      },
      data: CoinTransactionMapper.toPersistence(transaction),
    });

    return CoinTransactionMapper.toDomain(updatedTransaction);
  }

  async markAsExpired(
    transactionId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.coinTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        expiredAt: new Date(),
        remainingCoins: 0,
      },
    });
  }

  async updateRemainingCoins(
    params: {
      transactionId: string;
      remainingCoins: number;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    const { transactionId, remainingCoins } = params;

    await tx.coinTransaction.update({
      where: {
        id: transactionId,
      },
      data: {
        remainingCoins,
      },
    });
  }

  async delete(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.coinTransaction.delete({
      where: { id },
    });
  }
}

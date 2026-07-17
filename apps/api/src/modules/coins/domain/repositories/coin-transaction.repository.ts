import { Prisma } from '@prisma/client';

import { CoinTransaction } from '../entities/coin-transaction.entity';

import { CoinTransactionStatus } from '../enums/coin-transaction-status.enum';
import { CoinTransactionType } from '../enums/coin-transaction-type.enum';
import { RewardSourceType } from '../enums/reward-source-type.enum';

export interface CoinTransactionRepository {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<CoinTransaction | null>;

  findAll(tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByWalletId(walletId: string, tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByOrderId(orderId: string, tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByPaymentId(paymentId: string, tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByRedemptionId(
    redemptionId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinTransaction[]>;

  findPendingTransactions(tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByType(type: CoinTransactionType, tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findByStatus(
    status: CoinTransactionStatus,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinTransaction[]>;

  findBySourceType(
    sourceType: RewardSourceType,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinTransaction[]>;

  findByIdempotencyKey(
    idempotencyKey: string,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinTransaction | null>;

  findExpiredTransactions(tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findExpirableEarnTransactions(tx?: Prisma.TransactionClient): Promise<CoinTransaction[]>;

  findLatestByWalletId(
    walletId: string,
    limit?: number,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinTransaction[]>;

  findLatestByUserId(
    userId: string,
    limit?: number,
    tx?: Prisma.TransactionClient,
  ): Promise<CoinTransaction[]>;

  existsById(id: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  existsByIdempotencyKey(idempotencyKey: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  create(transaction: CoinTransaction, tx?: Prisma.TransactionClient): Promise<CoinTransaction>;

  update(transaction: CoinTransaction, tx?: Prisma.TransactionClient): Promise<CoinTransaction>;

  markAsExpired(transactionId: string, tx?: Prisma.TransactionClient): Promise<void>;

  updateRemainingCoins(
    params: {
      transactionId: string;
      remainingCoins: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

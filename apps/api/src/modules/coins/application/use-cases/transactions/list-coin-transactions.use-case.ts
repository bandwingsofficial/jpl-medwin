import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinTransaction } from '../../../domain/entities/coin-transaction.entity';

import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { CoinTransactionStatus } from '../../../domain/enums/coin-transaction-status.enum';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';

import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

@Injectable()
export class ListCoinTransactionsUseCase {
  constructor(
    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepo: CoinTransactionRepository,
  ) {}

  async execute(input?: {
    walletId?: string;
    userId?: string;
    orderId?: string;
    paymentId?: string;
    redemptionId?: string;
    type?: CoinTransactionType;
    status?: CoinTransactionStatus;
    sourceType?: RewardSourceType;
    pendingOnly?: boolean;
  }) {
    let transactions: CoinTransaction[] = [];

    if (input?.walletId) {
      transactions = await this.transactionRepo.findByWalletId(input.walletId);
    } else if (input?.userId) {
      transactions = await this.transactionRepo.findByUserId(input.userId);
    } else if (input?.orderId) {
      transactions = await this.transactionRepo.findByOrderId(input.orderId);
    } else if (input?.paymentId) {
      transactions = await this.transactionRepo.findByPaymentId(input.paymentId);
    } else if (input?.redemptionId) {
      transactions = await this.transactionRepo.findByRedemptionId(input.redemptionId);
    } else if (input?.type) {
      transactions = await this.transactionRepo.findByType(input.type);
    } else if (input?.status) {
      transactions = await this.transactionRepo.findByStatus(input.status);
    } else if (input?.sourceType) {
      transactions = await this.transactionRepo.findBySourceType(input.sourceType);
    } else if (input?.pendingOnly) {
      transactions = await this.transactionRepo.findPendingTransactions();
    } else {
      transactions = await this.transactionRepo.findAll();
    }

    return this.formatResponse(transactions);
  }

  private formatResponse(transactions: CoinTransaction[]) {
    return transactions.map((transaction) => ({
      id: transaction.id,
      walletId: transaction.walletId,
      userId: transaction.userId,
      type: transaction.type,
      status: transaction.status,
      sourceType: transaction.sourceType,
      coins: transaction.coins,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      orderId: transaction.orderId,
      paymentId: transaction.paymentId,
      redemptionId: transaction.redemptionId,
      description: transaction.description,
      metadata: transaction.metadata,
      expiresAt: transaction.expiresAt,
      expiredAt: transaction.expiredAt,
      remainingCoins: transaction.remainingCoins,
      createdByAdminId: transaction.createdByAdminId,
      idempotencyKey: transaction.idempotencyKey,
      createdAt: transaction.createdAt,
    }));
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWallet } from '../../../domain/entities/coin-wallet.entity';

import { CoinTransaction } from '../../../domain/entities/coin-transaction.entity';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

import { CoinTransactionStatus } from '../../../domain/enums/coin-transaction-status.enum';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';

import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

@Injectable()
export class CreateCoinTransactionUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,

    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepo: CoinTransactionRepository,
  ) {}

  async execute(
    input: {
      userId: string;
      type: CoinTransactionType;
      status?: CoinTransactionStatus;
      sourceType?: RewardSourceType;
      coins: number;
      balanceBefore: number;
      balanceAfter: number;
      orderId?: string;
      paymentId?: string;
      redemptionId?: string;
      description?: string;
      metadata?: Record<string, unknown>;
      expiresAt?: Date;
      expiredAt?: Date;
      remainingCoins?: number;
      createdByAdminId?: string;
      idempotencyKey?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    if (input.idempotencyKey) {
      const existingTransaction =
        await this.transactionRepo.findByIdempotencyKey(
          input.idempotencyKey,
          tx,
        );

      if (existingTransaction) {
        return {
          id: existingTransaction.id,
          walletId:
            existingTransaction.walletId,
          userId:
            existingTransaction.userId,
          type: existingTransaction.type,
          status:
            existingTransaction.status,
          sourceType:
            existingTransaction.sourceType,
          coins:
            existingTransaction.coins,
          balanceBefore:
            existingTransaction.balanceBefore,
          balanceAfter:
            existingTransaction.balanceAfter,
          orderId:
            existingTransaction.orderId,
          paymentId:
            existingTransaction.paymentId,
          redemptionId:
            existingTransaction.redemptionId,
          description:
            existingTransaction.description,
          metadata:
            existingTransaction.metadata,
          expiresAt:
            existingTransaction.expiresAt,
          expiredAt:
            existingTransaction.expiredAt,
          remainingCoins:
            existingTransaction.remainingCoins,
          createdByAdminId:
            existingTransaction.createdByAdminId,
          idempotencyKey:
            existingTransaction.idempotencyKey,
          createdAt:
            existingTransaction.createdAt,

          duplicated: true,
        };
      }
    }

    const wallet: CoinWallet | null =
      await this.walletRepo.findByUserId(
        input.userId,
        tx,
      );

    if (!wallet) {
      throw new WalletNotFoundException({
        userId: input.userId,
      });
    }

    const transaction = new CoinTransaction(
      randomUUID(),
      wallet.id,
      wallet.userId,
      input.type,
      input.status ??
        CoinTransactionStatus.SUCCESS,
      input.coins,
      input.balanceBefore,
      input.balanceAfter,
      input.sourceType ??
        RewardSourceType.SYSTEM,
      input.orderId,
      input.paymentId,
      input.redemptionId,
      input.description,
      input.metadata,
      input.expiresAt,
      input.expiredAt,
      input.remainingCoins,
      input.createdByAdminId,
      input.idempotencyKey,
    );

    const created =
      await this.transactionRepo.create(
        transaction,
        tx,
      );

    return {
      id: created.id,

      walletId: created.walletId,

      userId: created.userId,

      type: created.type,

      status: created.status,

      sourceType: created.sourceType,

      coins: created.coins,

      balanceBefore:
        created.balanceBefore,

      balanceAfter:
        created.balanceAfter,

      orderId: created.orderId,

      paymentId: created.paymentId,

      redemptionId:
        created.redemptionId,

      description:
        created.description,

      metadata: created.metadata,

      expiresAt: created.expiresAt,

      expiredAt: created.expiredAt,

      remainingCoins:
        created.remainingCoins,

      createdByAdminId:
        created.createdByAdminId,

      idempotencyKey:
        created.idempotencyKey,

      createdAt: created.createdAt,

      duplicated: false,
    };
  }
}
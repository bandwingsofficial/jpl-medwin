import { Inject, Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWallet } from '../../../domain/entities/coin-wallet.entity';

import { CoinTransaction } from '../../../domain/entities/coin-transaction.entity';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { CoinsDomainService } from '../../../domain/services/coins-domain.service';

import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

import { CoinTransactionStatus } from '../../../domain/enums/coin-transaction-status.enum';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';

import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

@Injectable()
export class DebitCoinsUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepository: CoinWalletRepository,

    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepository: CoinTransactionRepository,

    private readonly coinsDomainService: CoinsDomainService,
  ) {}

  async execute(
    input: {
      userId: string;
      coins: number;
      type?: CoinTransactionType;
      sourceType?: RewardSourceType;
      description?: string;
      orderId?: string;
      paymentId?: string;
      redemptionId?: string;
      metadata?: Record<string, unknown>;
      createdByAdminId?: string;
      idempotencyKey?: string;
    },
    tx?: Prisma.TransactionClient,
  ) {
    this.coinsDomainService.validateCoins(input.coins);

    if (input.idempotencyKey) {
      const existingTransaction =
        await this.transactionRepository.findByIdempotencyKey(
          input.idempotencyKey,
          tx,
        );

      if (existingTransaction) {
        return {
          wallet: null,
          transaction: existingTransaction,
          duplicated: true,
        };
      }
    }

    const wallet: CoinWallet | null =
      await this.walletRepository.findByUserId(
        input.userId,
        tx,
      );

    if (!wallet) {
      throw new WalletNotFoundException({
        userId: input.userId,
      });
    }

    this.coinsDomainService.ensureWalletHasBalance({
      wallet,
      requestedCoins: input.coins,
    });

    const balanceBefore = wallet.balance;

    const transactionType =
      input.type ?? CoinTransactionType.REDEEMED;

    wallet.debitCoins({
      coins: input.coins,
      transactionType,
    });

    const updatedWallet =
      await this.walletRepository.update(
        wallet,
        tx,
      );

    const transaction = new CoinTransaction(
      randomUUID(),
      updatedWallet.id,
      updatedWallet.userId,
      transactionType,
      CoinTransactionStatus.SUCCESS,
      input.coins,
      balanceBefore,
      updatedWallet.balance,
      input.sourceType ?? RewardSourceType.ORDER,
      input.orderId,
      input.paymentId,
      input.redemptionId,
      input.description,
      input.metadata,
      undefined,
      undefined,
      undefined,
      input.createdByAdminId,
      input.idempotencyKey,
    );

    const createdTransaction =
      await this.transactionRepository.create(
        transaction,
        tx,
      );

    if (
      transactionType ===
        CoinTransactionType.REDEEMED &&
      input.coins > 0
    ) {
      const earnTransactions =
        await this.transactionRepository.findExpirableEarnTransactions(
          tx,
        );

      const userEarnTransactions =
        earnTransactions.filter(
          (earnTransaction) =>
            earnTransaction.userId ===
              input.userId &&
            (earnTransaction.remainingCoins ?? 0) > 0,
        );

      let remainingDebitCoins = input.coins;

      for (const earnTransaction of userEarnTransactions) {
        if (remainingDebitCoins <= 0) {
          break;
        }

        const availableCoins =
          earnTransaction.remainingCoins ?? 0;

        const deductionCoins = Math.min(
          availableCoins,
          remainingDebitCoins,
        );

        await this.transactionRepository.updateRemainingCoins(
          {
            transactionId: earnTransaction.id,
            remainingCoins:
              availableCoins - deductionCoins,
          },
          tx,
        );

        remainingDebitCoins -= deductionCoins;
      }
    }

    return {
      wallet: {
        id: updatedWallet.id,
        userId: updatedWallet.userId,
        balance: updatedWallet.balance,
        lifetimeEarned:
          updatedWallet.lifetimeEarned,
        lifetimeRedeemed:
          updatedWallet.lifetimeRedeemed,
        lifetimeExpired:
          updatedWallet.lifetimeExpired,
        lifetimeRefunded:
          updatedWallet.lifetimeRefunded,
        updatedAt: updatedWallet.updatedAt,
      },

      transaction: {
        id: createdTransaction.id,
        type: createdTransaction.type,
        status: createdTransaction.status,
        coins: createdTransaction.coins,
        balanceBefore:
          createdTransaction.balanceBefore,
        balanceAfter:
          createdTransaction.balanceAfter,
        sourceType:
          createdTransaction.sourceType,
        description:
          createdTransaction.description,
        createdAt:
          createdTransaction.createdAt,
      },

      duplicated: false,
    };
  }
}
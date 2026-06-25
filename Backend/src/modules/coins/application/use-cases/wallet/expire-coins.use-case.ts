import { Inject, Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWallet } from '../../../domain/entities/coin-wallet.entity';
import { CoinTransaction } from '../../../domain/entities/coin-transaction.entity';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';
import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { CoinTransactionStatus } from '../../../domain/enums/coin-transaction-status.enum';
import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';
import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

@Injectable()
export class ExpireCoinsUseCase {
  private readonly logger = new Logger(ExpireCoinsUseCase.name);

  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,

    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepo: CoinTransactionRepository,
  ) {}

  async execute() {
    const expiredTransactions = await this.transactionRepo.findExpiredTransactions();

    const results: Array<{
      transactionId: string;
      walletId: string;
      expiredCoins: number;
      failedReason?: string;
    }> = [];

    for (const tx of expiredTransactions) {
      try {
        await this.prisma.$transaction(async (prismaTx) => {
          const wallet: CoinWallet | null = await this.walletRepo.findById(tx.walletId, prismaTx);

          if (!wallet) {
            results.push({
              transactionId: tx.id,
              walletId: tx.walletId,
              expiredCoins: 0,
              failedReason: 'Wallet not found',
            });

            return;
          }

          await this.walletRepo.lockWallet(wallet.id, prismaTx);

          const walletTransactions = await this.transactionRepo.findByWalletId(wallet.id, prismaTx);

          const existingExpiry = walletTransactions.find(
            (transaction) =>
              transaction.type === CoinTransactionType.EXPIRED &&
              transaction.metadata?.sourceTransactionId === tx.id,
          );

          if (existingExpiry) {
            results.push({
              transactionId: tx.id,
              walletId: wallet.id,
              expiredCoins: 0,
              failedReason: 'Already expired',
            });

            return;
          }

          const coinsToExpire = Math.min(wallet.balance, tx.remainingCoins ?? tx.coins);

          if (coinsToExpire <= 0) {
            await this.transactionRepo.markAsExpired(tx.id, prismaTx);

            results.push({
              transactionId: tx.id,
              walletId: wallet.id,
              expiredCoins: 0,
              failedReason: 'No balance left to expire',
            });

            return;
          }

          const currentRemainingCoins = tx.remainingCoins ?? tx.coins;

          await this.transactionRepo.updateRemainingCoins(
            {
              transactionId: tx.id,
              remainingCoins: Math.max(0, currentRemainingCoins - coinsToExpire),
            },
            prismaTx,
          );

          const balanceBefore = wallet.balance;

          wallet.expireCoins({
            coins: coinsToExpire,
          });

          const updatedWallet = await this.walletRepo.update(wallet, prismaTx);

          const expiredTransaction = new CoinTransaction(
            randomUUID(),
            updatedWallet.id,
            updatedWallet.userId,
            CoinTransactionType.EXPIRED,
            CoinTransactionStatus.SUCCESS,
            coinsToExpire,
            balanceBefore,
            updatedWallet.balance,
            RewardSourceType.SYSTEM,
            undefined,
            undefined,
            undefined,
            `Expired ${coinsToExpire} coins`,
            {
              sourceTransactionId: tx.id,
            },
            undefined,
            new Date(),
            0,
            undefined,
            undefined,
          );

          await this.transactionRepo.create(expiredTransaction, prismaTx);

          await this.transactionRepo.markAsExpired(tx.id, prismaTx);

          results.push({
            transactionId: tx.id,
            walletId: updatedWallet.id,
            expiredCoins: coinsToExpire,
          });
        });
      } catch (error) {
        this.logger.error(
          `Failed to expire transaction ${tx.id}`,
          error instanceof Error ? error.stack : undefined,
        );

        results.push({
          transactionId: tx.id,
          walletId: tx.walletId,
          expiredCoins: 0,
          failedReason: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return {
      totalProcessed: results.filter((result) => !result.failedReason).length,

      totalFailed: results.filter((result) => result.failedReason).length,

      results,
    };
  }
}

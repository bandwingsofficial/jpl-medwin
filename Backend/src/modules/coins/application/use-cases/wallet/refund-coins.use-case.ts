import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

import { TOKENS } from '@/common/constants/tokens';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';
import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

import { CoinsAlreadyRefundedException } from '../../../domain/exceptions/coins-already-refunded.exception';

import { RedemptionNotFoundException } from '../../../domain/exceptions/redemption-not-found.exception';

import { RedeemedTransactionNotFoundException } from '../../../domain/exceptions/redeemed-transaction-not-found.exception';

import { InvalidRefundAmountException } from '../../../domain/exceptions/invalid-refund-amount.exception';

import { CreditCoinsUseCase } from './credit-coins.use-case';

@Injectable()
export class RefundCoinsUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,

    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepo: CoinTransactionRepository,

    private readonly creditCoinsUseCase: CreditCoinsUseCase,
  ) {}

  async execute(input: { userId: string; orderId: string; coins: number; reason?: string }) {
    return this.prisma.$transaction(async (tx) => {
      const wallet = await this.walletRepo.findByUserId(input.userId, tx);

      if (!wallet) {
        throw new WalletNotFoundException({
          userId: input.userId,
        });
      }

      await this.walletRepo.lockWallet(wallet.id, tx);

      const orderTransactions = await this.transactionRepo.findByOrderId(input.orderId, tx);

      if (!orderTransactions || orderTransactions.length === 0) {
        throw new RedemptionNotFoundException();
      }

      const redeemedTransaction = orderTransactions.find(
        (transaction) => transaction.type === CoinTransactionType.REDEEMED,
      );

      if (!redeemedTransaction) {
        throw new RedeemedTransactionNotFoundException();
      }

      const alreadyRefundedCoins = orderTransactions
        .filter(
          (transaction) =>
            transaction.type === CoinTransactionType.REFUNDED ||
            transaction.type === CoinTransactionType.REDEEM_REVERSED,
        )
        .reduce((total, transaction) => total + transaction.coins, 0);

      if (input.coins <= 0) {
        throw new InvalidRefundAmountException();
      }

      if (alreadyRefundedCoins + input.coins > redeemedTransaction.coins) {
        throw new CoinsAlreadyRefundedException();
      }

      const result = await this.creditCoinsUseCase.execute(
        {
          userId: input.userId,

          coins: input.coins,

          type: CoinTransactionType.REDEEM_REVERSED,

          sourceType: RewardSourceType.REFUND,

          orderId: input.orderId,

          description: input.reason ?? `Refunded ${input.coins} coins`,

          metadata: {
            refundedOrderId: input.orderId,
            originalTransactionId: redeemedTransaction.id,
            alreadyRefundedCoins,
          },

          idempotencyKey: `refund-${input.orderId}-${alreadyRefundedCoins + input.coins}`,
        },
        tx,
      );

      return {
        refunded: true,

        orderId: input.orderId,

        refundedCoins: input.coins,

        totalRefundedCoins: alreadyRefundedCoins + input.coins,

        wallet: result.wallet
          ? {
              id: result.wallet.id,

              userId: result.wallet.userId,

              balance: result.wallet.balance,

              lifetimeEarned: result.wallet.lifetimeEarned,

              lifetimeRedeemed: result.wallet.lifetimeRedeemed,

              lifetimeExpired: result.wallet.lifetimeExpired,

              lifetimeRefunded: result.wallet.lifetimeRefunded,

              updatedAt: result.wallet.updatedAt,
            }
          : null,

        transaction: {
          id: result.transaction.id,

          type: result.transaction.type,

          status: result.transaction.status,

          coins: result.transaction.coins,

          balanceBefore: result.transaction.balanceBefore,

          balanceAfter: result.transaction.balanceAfter,

          sourceType: result.transaction.sourceType,

          description: result.transaction.description,

          createdAt: result.transaction.createdAt,
        },

        duplicated: result.duplicated,
      };
    });
  }
}

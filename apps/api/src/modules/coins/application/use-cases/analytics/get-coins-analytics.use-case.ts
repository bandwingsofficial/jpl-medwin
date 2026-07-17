import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';

@Injectable()
export class GetCoinsAnalyticsUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,

    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepo: CoinTransactionRepository,
  ) {}

  async execute() {
    const wallets = await this.walletRepo.findAll();

    const transactions = await this.transactionRepo.findAll();

    const totalWallets = wallets.length;

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    const totalLifetimeEarned = wallets.reduce((sum, wallet) => sum + wallet.lifetimeEarned, 0);

    const totalLifetimeRedeemed = wallets.reduce((sum, wallet) => sum + wallet.lifetimeRedeemed, 0);

    const totalLifetimeExpired = wallets.reduce((sum, wallet) => sum + wallet.lifetimeExpired, 0);

    const totalLifetimeRefunded = wallets.reduce((sum, wallet) => sum + wallet.lifetimeRefunded, 0);

    const earnedTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.EARNED || tx.type === CoinTransactionType.BONUS,
    );

    const redeemedTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.REDEEMED,
    );

    const reversedTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.REDEEM_REVERSED,
    );

    const expiredTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.EXPIRED,
    );

    const refundedTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.REFUNDED,
    );

    const bonusTransactions = transactions.filter((tx) => tx.type === CoinTransactionType.BONUS);

    const adminCreditTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.ADMIN_CREDIT,
    );

    const adminDebitTransactions = transactions.filter(
      (tx) => tx.type === CoinTransactionType.ADMIN_DEBIT,
    );

    const totalEarnedCoins = earnedTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalRedeemedCoins = redeemedTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalReversedCoins = reversedTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalExpiredCoins = expiredTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalRefundedCoins = refundedTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalBonusCoins = bonusTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalAdminCredits = adminCreditTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const totalAdminDebits = adminDebitTransactions.reduce((sum, tx) => sum + tx.coins, 0);

    const averageWalletBalance =
      totalWallets > 0 ? Number((totalBalance / totalWallets).toFixed(2)) : 0;

    return {
      wallets: {
        totalWallets,
        totalBalance,
        averageWalletBalance,
        totalLifetimeEarned,
        totalLifetimeRedeemed,
        totalLifetimeExpired,
        totalLifetimeRefunded,
      },

      transactions: {
        totalTransactions: transactions.length,
        earnedTransactions: earnedTransactions.length,
        redeemedTransactions: redeemedTransactions.length,
        reversedTransactions: reversedTransactions.length,
        expiredTransactions: expiredTransactions.length,
        refundedTransactions: refundedTransactions.length,
        bonusTransactions: bonusTransactions.length,
        adminCreditTransactions: adminCreditTransactions.length,
        adminDebitTransactions: adminDebitTransactions.length,
      },

      coins: {
        totalEarnedCoins,
        totalRedeemedCoins,
        totalReversedCoins,
        totalExpiredCoins,
        totalRefundedCoins,
        totalBonusCoins,
        totalAdminCredits,
        totalAdminDebits,
      },
    };
  }
}

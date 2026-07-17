import { Injectable } from '@nestjs/common';

import { CoinWallet } from '../entities/coin-wallet.entity';
import { RewardConfig } from '../entities/reward-config.entity';

import { InsufficientCoinsException } from '../exceptions/insufficient-coins.exception';
import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';
import { InactiveRewardConfigException } from '../exceptions/inactive-reward-config.exception';

@Injectable()
export class CoinsDomainService {
  validateCoins(coins: number) {
    if (!Number.isInteger(coins)) {
      throw new InvalidCoinTransactionException({
        message: 'Coins must be an integer value',
      });
    }

    if (coins <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Coins must be greater than zero',
      });
    }
  }

  validateAmount(amount: number) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Amount must be greater than zero',
      });
    }
  }

  ensureWalletHasBalance(params: { wallet: CoinWallet; requestedCoins: number }) {
    const { wallet, requestedCoins } = params;

    if (wallet.balance < requestedCoins) {
      throw new InsufficientCoinsException({
        availableCoins: wallet.balance,
        requestedCoins,
        userId: wallet.userId,
      });
    }
  }

  ensureRewardConfigActive(rewardConfig: RewardConfig) {
    if (rewardConfig.isInactive()) {
      throw new InactiveRewardConfigException({
        rewardConfigId: rewardConfig.id,
      });
    }
  }

  calculateEarnedCoins(params: { orderAmount: number; rewardConfig: RewardConfig }): number {
    const { orderAmount, rewardConfig } = params;

    this.validateAmount(orderAmount);

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateEarnedCoins(orderAmount);
  }

  calculateRedeemableAmount(params: { coins: number; rewardConfig: RewardConfig }): number {
    const { coins, rewardConfig } = params;

    this.validateCoins(coins);

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateCoinValue(coins);
  }

  calculateMaxRedeemableCoins(params: { orderAmount: number; rewardConfig: RewardConfig }): number {
    const { orderAmount, rewardConfig } = params;

    this.validateAmount(orderAmount);

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateMaxRedeemableCoins(orderAmount);
  }

  validateRedemption(params: {
    wallet: CoinWallet;
    requestedCoins: number;
    orderAmount: number;
    rewardConfig: RewardConfig;
  }) {
    const { wallet, requestedCoins, orderAmount, rewardConfig } = params;

    this.validateCoins(requestedCoins);

    this.validateAmount(orderAmount);

    this.ensureRewardConfigActive(rewardConfig);

    this.ensureWalletHasBalance({
      wallet,
      requestedCoins,
    });

    if (
      rewardConfig.minimumOrderAmount !== undefined &&
      orderAmount < rewardConfig.minimumOrderAmount
    ) {
      throw new InvalidCoinTransactionException({
        message: `Minimum order amount should be ${rewardConfig.minimumOrderAmount}`,
      });
    }

    const maxRedeemableCoins = rewardConfig.calculateMaxRedeemableCoins(orderAmount);

    if (requestedCoins > maxRedeemableCoins) {
      throw new InvalidCoinTransactionException({
        message: `Maximum redeemable coins is ${maxRedeemableCoins}`,
      });
    }
  }

  calculateExpiryDate(params: { rewardConfig: RewardConfig; fromDate?: Date }): Date {
    const { rewardConfig, fromDate } = params;

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateExpiryDate(fromDate);
  }
}

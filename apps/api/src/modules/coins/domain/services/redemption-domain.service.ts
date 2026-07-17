import { Injectable } from '@nestjs/common';

import { CoinWallet } from '../entities/coin-wallet.entity';
import { RewardConfig } from '../entities/reward-config.entity';

import { InsufficientCoinsException } from '../exceptions/insufficient-coins.exception';
import { InactiveRewardConfigException } from '../exceptions/inactive-reward-config.exception';
import { InvalidCoinTransactionException } from '../exceptions/invalid-coin-transaction.exception';

@Injectable()
export class RedemptionDomainService {
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

  validateOrderAmount(orderAmount: number) {
    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      throw new InvalidCoinTransactionException({
        message: 'Order amount must be greater than zero',
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

  calculateMaxRedeemableCoins(params: { orderAmount: number; rewardConfig: RewardConfig }): number {
    const { orderAmount, rewardConfig } = params;

    this.validateOrderAmount(orderAmount);

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateMaxRedeemableCoins(orderAmount);
  }

  calculateRedeemableAmount(params: { coins: number; rewardConfig: RewardConfig }): number {
    const { coins, rewardConfig } = params;

    this.validateCoins(coins);

    this.ensureRewardConfigActive(rewardConfig);

    return rewardConfig.calculateCoinValue(coins);
  }

  validateRedemption(params: {
    wallet: CoinWallet;
    rewardConfig: RewardConfig;
    requestedCoins: number;
    orderAmount: number;
  }) {
    const { wallet, rewardConfig, requestedCoins, orderAmount } = params;

    this.validateCoins(requestedCoins);

    this.validateOrderAmount(orderAmount);

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

    const maxRedeemableCoins = this.calculateMaxRedeemableCoins({
      orderAmount,
      rewardConfig,
    });

    if (requestedCoins > maxRedeemableCoins) {
      throw new InvalidCoinTransactionException({
        message: `Maximum redeemable coins is ${maxRedeemableCoins}`,
      });
    }
  }

  calculateFinalPayableAmount(params: { orderAmount: number; redeemedAmount: number }): number {
    const { orderAmount, redeemedAmount } = params;

    this.validateOrderAmount(orderAmount);

    if (!Number.isFinite(redeemedAmount) || redeemedAmount < 0) {
      throw new InvalidCoinTransactionException({
        message: 'Redeemed amount cannot be negative',
      });
    }

    const finalAmount = orderAmount - redeemedAmount;

    return Number(Math.max(0, finalAmount).toFixed(2));
  }
}

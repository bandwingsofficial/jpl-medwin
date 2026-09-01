import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinsDomainService } from '../../domain/services/coins-domain.service';

import { CoinWalletRepository } from '../../domain/repositories/coin-wallet.repository';
import { CoinTransactionRepository } from '../../domain/repositories/coin-transaction.repository';
import { RewardConfigRepository } from '../../domain/repositories/reward-config.repository';

import { CoinTransactionStatus } from '../../domain/enums/coin-transaction-status.enum';
import { CoinTransactionType } from '../../domain/enums/coin-transaction-type.enum';

import { RewardConfigNotFoundException } from '../../domain/exceptions/reward-config-not-found.exception';
import { WalletNotFoundException } from '../../domain/exceptions/wallet-not-found.exception';

@Injectable()
export class CoinsApplicationService {
  constructor(
    private readonly coinsDomainService: CoinsDomainService,

    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepository: CoinWalletRepository,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,

    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepository: CoinTransactionRepository,
  ) {}

  async getWalletByUserId(userId: string) {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new WalletNotFoundException({
        userId,
      });
    }

    return wallet;
  }

  async getWalletById(walletId: string) {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) {
      throw new WalletNotFoundException({
        walletId,
      });
    }

    return wallet;
  }

  async getActiveRewardConfig() {
    const rewardConfig = await this.rewardConfigRepository.findActiveConfig();

    if (!rewardConfig) {
      throw new RewardConfigNotFoundException();
    }

    rewardConfig.ensureActive();

    return rewardConfig;
  }

  async calculateEarnedCoins(params: { orderAmount: number }) {
    const { orderAmount } = params;

    const rewardConfig = await this.getActiveRewardConfig();

    return this.coinsDomainService.calculateEarnedCoins({
      orderAmount,
      rewardConfig,
    });
  }

  async calculateRedeemableAmount(params: { coins: number }) {
    const { coins } = params;

    const rewardConfig = await this.getActiveRewardConfig();

    return this.coinsDomainService.calculateRedeemableAmount({
      coins,
      rewardConfig,
    });
  }

  async calculateMaxRedeemableCoins(params: { orderAmount: number }) {
    const { orderAmount } = params;

    const rewardConfig = await this.getActiveRewardConfig();

    return this.coinsDomainService.calculateMaxRedeemableCoins({
      orderAmount,
      rewardConfig,
    });
  }

  async getWalletTransactions(walletId: string) {
    await this.getWalletById(walletId);

    return this.transactionRepository.findByWalletId(walletId);
  }

  async getUserTransactions(userId: string) {
    await this.getWalletByUserId(userId);

    return this.transactionRepository.findByUserId(userId);
  }

  async getOrderTransactions(orderId: string) {
    return this.transactionRepository.findByOrderId(orderId);
  }

  async getTransactionsByType(type: CoinTransactionType) {
    return this.transactionRepository.findByType(type);
  }

  async getTransactionsByStatus(status: CoinTransactionStatus) {
    return this.transactionRepository.findByStatus(status);
  }
}

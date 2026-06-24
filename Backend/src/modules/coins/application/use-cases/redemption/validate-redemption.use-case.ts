import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';
import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';

import { RedemptionDomainService } from '../../../domain/services/redemption-domain.service';

import { RewardConfigNotFoundException } from '../../../domain/exceptions/reward-config-not-found.exception';
import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

@Injectable()
export class ValidateRedemptionUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepository: CoinWalletRepository,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,

    private readonly redemptionDomainService: RedemptionDomainService,
  ) {}

  async execute(input: {
    userId: string;
    coins: number;
    orderAmount: number;
  }) {
    const wallet =
      await this.walletRepository.findByUserId(
        input.userId,
      );

    if (!wallet) {
      throw new WalletNotFoundException({
        userId: input.userId,
      });
    }

    const rewardConfig =
      await this.rewardConfigRepository.findActiveConfig();

    if (!rewardConfig) {
      throw new RewardConfigNotFoundException();
    }

    rewardConfig.ensureActive();

    this.redemptionDomainService.validateRedemption({
      wallet,
      rewardConfig,
      requestedCoins: input.coins,
      orderAmount: input.orderAmount,
    });

    const redeemedAmount =
      this.redemptionDomainService.calculateRedeemableAmount(
        {
          coins: input.coins,
          rewardConfig,
        },
      );

    const maxRedeemableCoins =
      this.redemptionDomainService.calculateMaxRedeemableCoins(
        {
          orderAmount: input.orderAmount,
          rewardConfig,
        },
      );

    const finalPayableAmount =
      this.redemptionDomainService.calculateFinalPayableAmount(
        {
          orderAmount: input.orderAmount,
          redeemedAmount,
        },
      );

    return {
      valid: true,

      wallet: {
        walletId: wallet.id,

        userId: wallet.userId,

        balance: wallet.balance,

        remainingBalance:
          wallet.balance - input.coins,

        hasSufficientBalance:
          wallet.hasSufficientBalance(
            input.coins,
          ),

        isEmpty: wallet.isEmpty(),
      },

      redemption: {
        requestedCoins: input.coins,

        redeemedAmount,

        maxRedeemableCoins,

        coinValue:
          rewardConfig.coinValue,
      },

      payable: {
        originalAmount:
          input.orderAmount,

        redeemedAmount,

        finalPayableAmount,
      },

      config: {
        coinValue:
          rewardConfig.coinValue,

        maxRedemptionPercentage:
          rewardConfig.maxRedemptionPercentage,

        minimumOrderAmount:
          rewardConfig.minimumOrderAmount,

        rewardOnDelivered:
          rewardConfig.rewardOnDelivered,

        expiryMonths:
          rewardConfig.expiryMonths,
      },
    };
  }
}
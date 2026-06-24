import { Inject, Injectable } from '@nestjs/common';

import { randomUUID } from 'crypto';

import { TOKENS } from '@/common/constants/tokens';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

import { CoinRedemption } from '../../../domain/entities/coin-redemption.entity';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';

import { CoinRedemptionStatus } from '../../../domain/enums/coin-redemption-status.enum';

import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { CoinRedemptionRepository } from '../../../domain/repositories/coin-redemption.repository';

import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';

import { RedemptionDomainService } from '../../../domain/services/redemption-domain.service';

import { AlreadyRedeemedException } from '../../../domain/exceptions/already-redeemed.exception';

import { RewardConfigNotFoundException } from '../../../domain/exceptions/reward-config-not-found.exception';

import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

import { DebitCoinsUseCase } from '../wallet/debit-coins.use-case';

@Injectable()
export class RedeemCoinsUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepository: CoinWalletRepository,

    @Inject(TOKENS.COIN_REDEMPTION_REPO)
    private readonly redemptionRepository: CoinRedemptionRepository,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepository: RewardConfigRepository,

    private readonly redemptionDomainService: RedemptionDomainService,

    private readonly debitCoinsUseCase: DebitCoinsUseCase,

    private readonly prisma: PrismaService,
  ) {}

  async execute(input: {
    userId: string;

    orderId: string;

    coins: number;

    orderAmount: number;

    paymentId?: string;

    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.$transaction(async (tx) => {
      // =======================
      // 🔍 EXISTING REDEMPTION
      // =======================

      const existingRedemption =
        await this.redemptionRepository.findByOrderId(
          input.orderId,
          tx,
        );

      // =======================
      // ❌ ALREADY REDEEMED
      // =======================

      if (existingRedemption) {
        throw new AlreadyRedeemedException({
          orderId:
            input.orderId,
        });
      }

      // =======================
      // 👛 FIND WALLET
      // =======================

      const wallet =
        await this.walletRepository.findByUserId(
          input.userId,
          tx,
        );

      // =======================
      // ❌ WALLET NOT FOUND
      // =======================

      if (!wallet) {
        throw new WalletNotFoundException({
          userId:
            input.userId,
        });
      }

      // =======================
      // 🔒 LOCK WALLET
      // =======================

      await this.walletRepository.lockWallet(
        wallet.id,
        tx,
      );

      // =======================
      // ⚙️ REWARD CONFIG
      // =======================

      const rewardConfig =
        await this.rewardConfigRepository.findActiveConfig(
          tx,
        );

      // =======================
      // ❌ CONFIG NOT FOUND
      // =======================

      if (!rewardConfig) {
        throw new RewardConfigNotFoundException();
      }

      rewardConfig.ensureActive();

      // =======================
      // 🛡 VALIDATE REDEMPTION
      // =======================

      this.redemptionDomainService.validateRedemption(
        {
          wallet,

          rewardConfig,

          requestedCoins:
            input.coins,

          orderAmount:
            input.orderAmount,
        },
      );

      // =======================
      // 💰 CALCULATE AMOUNT
      // =======================

      const redeemedAmount =
        this.redemptionDomainService.calculateRedeemableAmount(
          {
            coins:
              input.coins,

            rewardConfig,
          },
        );

      // =======================
      // 🪙 CREATE REDEMPTION
      // =======================

      const redemption =
        new CoinRedemption(
          randomUUID(),

          input.userId,

          wallet.id,

          input.orderId,

          CoinRedemptionStatus.APPLIED,

          input.coins,

          redeemedAmount,
        );

      // =======================
      // 💾 SAVE REDEMPTION
      // =======================

      const createdRedemption =
        await this.redemptionRepository.create(
          redemption,
          tx,
        );

      // =======================
      // 💳 DEBIT COINS
      // =======================

      const debitResult =
        await this.debitCoinsUseCase.execute(
          {
            userId:
              input.userId,

            coins:
              input.coins,

            type:
              CoinTransactionType.REDEEMED,

            sourceType:
              RewardSourceType.REDEMPTION,

            orderId:
              input.orderId,

            paymentId:
              input.paymentId,

            redemptionId:
              createdRedemption.id,

            metadata: {
              ...(input.metadata ?? {}),

              redeemedAmount,

              orderAmount:
                input.orderAmount,

              redemptionId:
                createdRedemption.id,
            },

            description:
              `Redeemed ${input.coins} coins for order ${input.orderId}`,

            idempotencyKey:
              `redeem-${input.orderId}`,
          },

          tx,
        );

      // =======================
      // 💵 FINAL PAYABLE
      // =======================

      const finalPayableAmount =
        this.redemptionDomainService.calculateFinalPayableAmount(
          {
            orderAmount:
              input.orderAmount,

            redeemedAmount,
          },
        );

      // =======================
      // 🚀 RESPONSE
      // =======================

      return {
        redemption: {
          id:
            createdRedemption.id,

          orderId:
            createdRedemption.orderId,

          status:
            createdRedemption.status,

          redeemedCoins:
            createdRedemption.redeemedCoins,

          redeemedAmount:
            createdRedemption.redeemedAmount,

          createdAt:
            createdRedemption.createdAt,

          updatedAt:
            createdRedemption.updatedAt,
        },

        wallet:
          debitResult.wallet,

        transaction:
          debitResult.transaction,

        payable: {
          originalAmount:
            input.orderAmount,

          redeemedAmount,

          finalPayableAmount,
        },
      };
    });
  }
}
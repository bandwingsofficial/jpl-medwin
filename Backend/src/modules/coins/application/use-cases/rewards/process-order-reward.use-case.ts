import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

import { TOKENS } from '@/common/constants/tokens';

import { RewardCampaign } from '../../../domain/entities/reward-campaign.entity';
import { RewardTier } from '../../../domain/entities/reward-tier.entity';

import { RewardConfigRepository } from '../../../domain/repositories/reward-config.repository';
import { RewardTierRepository } from '../../../domain/repositories/reward-tier.repository';
import { RewardCampaignRepository } from '../../../domain/repositories/reward-campaign.repository';

import { RewardsDomainService } from '../../../domain/services/rewards-domain.service';

import { RewardConfigNotFoundException } from '../../../domain/exceptions/reward-config-not-found.exception';

import { CoinTransactionType } from '../../../domain/enums/coin-transaction-type.enum';
import { RewardSourceType } from '../../../domain/enums/reward-source-type.enum';

import { CreditCoinsUseCase } from '../wallet/credit-coins.use-case';

@Injectable()
export class ProcessOrderRewardUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.REWARD_CONFIG_REPO)
    private readonly rewardConfigRepo: RewardConfigRepository,

    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepo: RewardTierRepository,

    @Inject(TOKENS.REWARD_CAMPAIGN_REPO)
    private readonly rewardCampaignRepo: RewardCampaignRepository,

    private readonly rewardsDomainService: RewardsDomainService,

    private readonly creditCoinsUseCase: CreditCoinsUseCase,
  ) {}

  async execute(input: {
    userId: string;
    orderId: string;
    orderAmount: number;
    paymentId?: string;
    rewardTierId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.$transaction(async (tx) => {
      this.rewardsDomainService.validateOrderAmount(
        input.orderAmount,
      );

      const rewardConfig =
        await this.rewardConfigRepo.findActiveConfig(
          tx,
        );

      if (!rewardConfig) {
        throw new RewardConfigNotFoundException();
      }

      rewardConfig.ensureActive();

      let rewardTier: RewardTier | null = null;

      if (input.rewardTierId) {
        rewardTier =
          await this.rewardTierRepo.findById(
            input.rewardTierId,
            tx,
          );
      }

      const campaigns =
        await this.rewardCampaignRepo.findCurrentCampaigns(
          tx,
        );

      let campaign: RewardCampaign | null = null;

      if (campaigns.length > 0) {
        campaign = campaigns[0];
      }

      const finalCoins =
        this.rewardsDomainService.calculateFinalRewardCoins(
          {
            orderAmount:
              input.orderAmount,
            rewardConfig,
            rewardTier,
            campaign,
          },
        );

      if (finalCoins <= 0) {
        return {
          rewarded: false,
          earnedCoins: 0,
        };
      }

      const expiresAt =
        rewardConfig.calculateExpiryDate();

      let description =
        `Earned ${finalCoins} coins from order ${input.orderId}`;

      if (rewardTier) {
        description +=
          ` with ${rewardTier.name} tier`;
      }

      if (campaign) {
        description +=
          ` + ${campaign.title} campaign`;
      }

      const result =
        await this.creditCoinsUseCase.execute(
          {
            userId: input.userId,

            coins: finalCoins,

            type:
              CoinTransactionType.EARNED,

            sourceType:
              RewardSourceType.ORDER,

            orderId: input.orderId,

            paymentId:
              input.paymentId,

            expiresAt,

            metadata: {
              ...(input.metadata ??
                {}),
              orderAmount:
                input.orderAmount,
              rewardTierId:
                rewardTier?.id,
              rewardCampaignId:
                campaign?.id,
            },

            description,

            idempotencyKey:
              `reward-${input.orderId}`,
          },
          tx,
        );

      const baseCoins =
        rewardConfig.calculateEarnedCoins(
          input.orderAmount,
        );

      const tierCoins = rewardTier
        ? rewardTier.calculateRewardCoins(
            baseCoins,
          )
        : baseCoins;

      const campaignBonus =
        finalCoins - tierCoins;

      return {
        rewarded: true,

        wallet: result.wallet,

        transaction:
          result.transaction,

        rewards: {
          orderAmount:
            input.orderAmount,

          baseCoins,

          tierCoins,

          campaignBonus,

          finalCoins,
        },

        tier: rewardTier
          ? {
              id: rewardTier.id,

              name: rewardTier.name,

              status:
                rewardTier.status,

              multiplier:
                rewardTier.coinMultiplier,
            }
          : null,

        campaign: campaign
          ? {
              id: campaign.id,

              title:
                campaign.title,

              bonusMultiplier:
                campaign.bonusMultiplier,
            }
          : null,

        expiresAt,

        duplicated:
          result.duplicated,
      };
    });
  }
}
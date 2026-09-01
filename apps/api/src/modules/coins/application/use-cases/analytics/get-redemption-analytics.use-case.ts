import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinRedemption } from '../../../domain/entities/coin-redemption.entity';

import { CoinRedemptionRepository } from '../../../domain/repositories/coin-redemption.repository';

import { CoinRedemptionStatus } from '../../../domain/enums/coin-redemption-status.enum';

@Injectable()
export class GetRedemptionAnalyticsUseCase {
  constructor(
    @Inject(TOKENS.COIN_REDEMPTION_REPO)
    private readonly redemptionRepo: CoinRedemptionRepository,
  ) {}

  async execute() {
    const redemptions = await this.redemptionRepo.findAll();

    const totalRedemptions = redemptions.length;

    const totalRedeemedCoins = redemptions.reduce(
      (sum, redemption) => sum + redemption.redeemedCoins,
      0,
    );

    const totalRedeemedAmount = Number(
      redemptions.reduce((sum, redemption) => sum + redemption.redeemedAmount, 0).toFixed(2),
    );

    const appliedRedemptions = redemptions.filter(
      (redemption) => redemption.status === CoinRedemptionStatus.APPLIED,
    );

    const reversedRedemptions = redemptions.filter(
      (redemption) => redemption.status === CoinRedemptionStatus.REVERSED,
    );

    const failedRedemptions = redemptions.filter(
      (redemption) => redemption.status === CoinRedemptionStatus.FAILED,
    );

    const pendingRedemptions = redemptions.filter(
      (redemption) => redemption.status === CoinRedemptionStatus.PENDING,
    );

    const uniqueUsers = new Set(redemptions.map((redemption) => redemption.userId));

    const averageRedeemedCoins =
      totalRedemptions > 0 ? Number((totalRedeemedCoins / totalRedemptions).toFixed(2)) : 0;

    const averageRedeemedAmount =
      totalRedemptions > 0 ? Number((totalRedeemedAmount / totalRedemptions).toFixed(2)) : 0;

    let highestRedemption: CoinRedemption | null = null;

    if (redemptions.length > 0) {
      highestRedemption = redemptions.reduce((highest, current) =>
        current.redeemedAmount > highest.redeemedAmount ? current : highest,
      );
    }

    return {
      summary: {
        totalRedemptions,
        totalRedeemedCoins,
        totalRedeemedAmount,
        uniqueUsers: uniqueUsers.size,
      },

      status: {
        applied: appliedRedemptions.length,
        reversed: reversedRedemptions.length,
        failed: failedRedemptions.length,
        pending: pendingRedemptions.length,
      },

      averages: {
        averageRedeemedCoins,
        averageRedeemedAmount,
      },

      highestRedemption: highestRedemption
        ? {
            redemptionId: highestRedemption.id,
            userId: highestRedemption.userId,
            orderId: highestRedemption.orderId,
            status: highestRedemption.status,
            redeemedCoins: highestRedemption.redeemedCoins,
            redeemedAmount: highestRedemption.redeemedAmount,
            createdAt: highestRedemption.createdAt,
          }
        : null,
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { RewardTier } from '../../../domain/entities/reward-tier.entity';

import { CoinWallet } from '../../../domain/entities/coin-wallet.entity';

import { RewardTierRepository } from '../../../domain/repositories/reward-tier.repository';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { RewardTierNotFoundException } from '../../../domain/exceptions/reward-tier-not-found.exception';

import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

@Injectable()
export class AssignTierUseCase {
  constructor(
    @Inject(TOKENS.REWARD_TIER_REPO)
    private readonly rewardTierRepo: RewardTierRepository,

    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,
  ) {}

  async execute(input: { userId: string }) {
    const wallet: CoinWallet | null = await this.walletRepo.findByUserId(input.userId);

    if (!wallet) {
      throw new WalletNotFoundException({
        userId: input.userId,
      });
    }

    const assignedTier = await this.rewardTierRepo.findEligibleTier({
      lifetimeSpend: wallet.lifetimeEarned,
    });

    if (!assignedTier) {
      throw new RewardTierNotFoundException({
        message: 'No matching reward tier found',
      });
    }

    return {
      userId: wallet.userId,
      walletId: wallet.id,
      lifetimeEarned: wallet.lifetimeEarned,
      assignedTier: {
        id: assignedTier.id,
        name: assignedTier.name,
        description: assignedTier.description,
        status: assignedTier.status,
        coinMultiplier: assignedTier.coinMultiplier,
        minimumLifetimeSpend: assignedTier.minimumLifetimeSpend,
        badgeImage: assignedTier.badgeImage,
        isActive: assignedTier.isActive(),
      },
    };
  }
}

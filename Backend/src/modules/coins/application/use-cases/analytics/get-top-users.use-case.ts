import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWallet } from '../../../domain/entities/coin-wallet.entity';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

@Injectable()
export class GetTopUsersUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,
  ) {}

  async execute(input?: { limit?: number }) {
    const limit = input?.limit ?? 10;

    const wallets = await this.walletRepo.findAll();

    const sortedWallets = [...wallets].sort((a, b) => b.balance - a.balance);

    const topUsers = sortedWallets.slice(0, limit).map((wallet: CoinWallet, index) => ({
      rank: index + 1,
      walletId: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      lifetimeEarned: wallet.lifetimeEarned,
      lifetimeRedeemed: wallet.lifetimeRedeemed,
      lifetimeExpired: wallet.lifetimeExpired,
      lifetimeRefunded: wallet.lifetimeRefunded,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    }));

    const totalUsers = wallets.length;

    const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);

    return {
      totalUsers,
      totalBalance,
      limit,
      users: topUsers,
    };
  }
}

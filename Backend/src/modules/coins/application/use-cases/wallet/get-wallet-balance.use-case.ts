import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinWallet } from '../../../domain/entities/coin-wallet.entity';

import { CoinWalletRepository } from '../../../domain/repositories/coin-wallet.repository';

import { WalletNotFoundException } from '../../../domain/exceptions/wallet-not-found.exception';

import { InvalidWalletQueryException } from '../../../domain/exceptions/invalid-wallet-query.exception';

@Injectable()
export class GetWalletBalanceUseCase {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepo: CoinWalletRepository,
  ) {}

  async execute(input: {
    walletId?: string;
    userId?: string;
  }) {
    if (!input.walletId && !input.userId) {
      throw new InvalidWalletQueryException();
    }

    let wallet: CoinWallet | null = null;

    if (input.walletId) {
      wallet = await this.walletRepo.findById(
        input.walletId,
      );
    } else if (input.userId) {
      wallet =
        await this.walletRepo.findByUserId(
          input.userId,
        );
    }

    if (!wallet) {
      throw new WalletNotFoundException({
        walletId: input.walletId,
        userId: input.userId,
      });
    }

    return {
      walletId: wallet.id,

      userId: wallet.userId,

      balance: wallet.balance,

      isEmpty: wallet.isEmpty(),

      hasBalance: wallet.balance > 0,

      lifetimeEarned:
        wallet.lifetimeEarned,

      lifetimeRedeemed:
        wallet.lifetimeRedeemed,

      lifetimeExpired:
        wallet.lifetimeExpired,

      lifetimeRefunded:
        wallet.lifetimeRefunded,

      createdAt: wallet.createdAt,

      updatedAt: wallet.updatedAt,
    };
  }
}
import { Injectable, Inject } from '@nestjs/common';

import { randomUUID } from 'crypto';
import { TOKENS } from '@/common/constants/tokens';
import { CoinWallet } from '../../domain/entities/coin-wallet.entity';
import { CoinWalletRepository } from '../../domain/repositories/coin-wallet.repository';
import { WalletNotFoundException } from '../../domain/exceptions/wallet-not-found.exception';

@Injectable()
export class WalletApplicationService {
  constructor(
    @Inject(TOKENS.COIN_WALLET_REPO)
    private readonly walletRepository: CoinWalletRepository,
  ) {}

  async createWallet(userId: string): Promise<CoinWallet> {
    const existingWallet = await this.walletRepository.findByUserId(userId);

    if (existingWallet) {
      return existingWallet;
    }

    const wallet = new CoinWallet(randomUUID(), userId, 0, 0, 0, 0, 0);

    return this.walletRepository.create(wallet);
  }

  async getWalletByUserId(userId: string): Promise<CoinWallet> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new WalletNotFoundException({
        userId,
      });
    }

    return wallet;
  }

  async getWalletById(walletId: string): Promise<CoinWallet> {
    const wallet = await this.walletRepository.findById(walletId);

    if (!wallet) {
      throw new WalletNotFoundException({
        walletId,
      });
    }

    return wallet;
  }

  async getAllWallets() {
    return this.walletRepository.findAll();
  }
}

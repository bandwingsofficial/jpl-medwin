import { Prisma } from '@prisma/client';

import { CoinWallet } from '../entities/coin-wallet.entity';

export interface CoinWalletRepository {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<CoinWallet | null>;

  findByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<CoinWallet | null>;

  findAll(tx?: Prisma.TransactionClient): Promise<CoinWallet[]>;

  existsById(id: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  existsByUserId(userId: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  create(wallet: CoinWallet, tx?: Prisma.TransactionClient): Promise<CoinWallet>;

  update(wallet: CoinWallet, tx?: Prisma.TransactionClient): Promise<CoinWallet>;

  incrementBalance(
    params: {
      walletId: string;
      coins: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  decrementBalance(
    params: {
      walletId: string;
      coins: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  updateLifetimeStats(
    params: {
      walletId: string;
      earnedCoins?: number;
      redeemedCoins?: number;
      expiredCoins?: number;
      refundedCoins?: number;
    },
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  lockWallet(walletId: string, tx?: Prisma.TransactionClient): Promise<void>;

  delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

import { Injectable } from '@nestjs/common';

import { Prisma, PrismaClient } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CoinWalletRepository } from '../../../../domain/repositories/coin-wallet.repository';

import { CoinWallet } from '../../../../domain/entities/coin-wallet.entity';

import { CoinWalletMapper } from '../mappers/coin-wallet.mapper';

@Injectable()
export class PrismaCoinWalletRepository implements CoinWalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinWallet | null> {
    const wallet = await tx.coinWallet.findUnique({
      where: { id },
    });

    return wallet ? CoinWalletMapper.toDomain(wallet) : null;
  }

  async findByUserId(
    userId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinWallet | null> {
    const wallet = await tx.coinWallet.findUnique({
      where: { userId },
    });

    return wallet ? CoinWalletMapper.toDomain(wallet) : null;
  }

  async findAll(tx: Prisma.TransactionClient | PrismaClient = this.prisma): Promise<CoinWallet[]> {
    const wallets = await tx.coinWallet.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return wallets.map((wallet) => CoinWalletMapper.toDomain(wallet));
  }

  async existsById(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.coinWallet.count({
      where: { id },
    });

    return count > 0;
  }

  async existsByUserId(
    userId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<boolean> {
    const count = await tx.coinWallet.count({
      where: { userId },
    });

    return count > 0;
  }

  async create(
    wallet: CoinWallet,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinWallet> {
    const createdWallet = await tx.coinWallet.create({
      data: CoinWalletMapper.toPersistence(wallet),
    });

    return CoinWalletMapper.toDomain(createdWallet);
  }

  async update(
    wallet: CoinWallet,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<CoinWallet> {
    const updatedWallet = await tx.coinWallet.update({
      where: {
        id: wallet.id,
      },
      data: CoinWalletMapper.toPersistence(wallet),
    });

    return CoinWalletMapper.toDomain(updatedWallet);
  }

  async incrementBalance(
    params: {
      walletId: string;
      coins: number;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    const { walletId, coins } = params;

    await tx.coinWallet.update({
      where: {
        id: walletId,
      },
      data: {
        balance: {
          increment: coins,
        },
      },
    });
  }

  async decrementBalance(
    params: {
      walletId: string;
      coins: number;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    const { walletId, coins } = params;

    await tx.coinWallet.update({
      where: {
        id: walletId,
        balance: {
          gte: coins,
        },
      },
      data: {
        balance: {
          decrement: coins,
        },
      },
    });
  }

  async updateLifetimeStats(
    params: {
      walletId: string;
      earnedCoins?: number;
      redeemedCoins?: number;
      expiredCoins?: number;
      refundedCoins?: number;
    },
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    const { walletId, earnedCoins, redeemedCoins, expiredCoins, refundedCoins } = params;

    await tx.coinWallet.update({
      where: {
        id: walletId,
      },
      data: {
        lifetimeEarned:
          earnedCoins !== undefined
            ? {
                increment: earnedCoins,
              }
            : undefined,

        lifetimeRedeemed:
          redeemedCoins !== undefined
            ? {
                increment: redeemedCoins,
              }
            : undefined,

        lifetimeExpired:
          expiredCoins !== undefined
            ? {
                increment: expiredCoins,
              }
            : undefined,

        lifetimeRefunded:
          refundedCoins !== undefined
            ? {
                increment: refundedCoins,
              }
            : undefined,
      },
    });
  }

  async lockWallet(
    walletId: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.$queryRaw`
      SELECT id
      FROM "CoinWallet"
      WHERE id = ${walletId}
      FOR UPDATE
    `;
  }

  async delete(
    id: string,
    tx: Prisma.TransactionClient | PrismaClient = this.prisma,
  ): Promise<void> {
    await tx.coinWallet.delete({
      where: { id },
    });
  }
}

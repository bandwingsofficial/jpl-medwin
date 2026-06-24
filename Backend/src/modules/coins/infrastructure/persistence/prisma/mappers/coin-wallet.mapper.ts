import { CoinWallet as PrismaCoinWallet } from '@prisma/client';

import { CoinWallet } from '../../../../domain/entities/coin-wallet.entity';

export class CoinWalletMapper {
  static toDomain(
    prismaWallet: PrismaCoinWallet,
  ): CoinWallet {
    return new CoinWallet(
      prismaWallet.id,
      prismaWallet.userId,
      prismaWallet.balance,
      prismaWallet.lifetimeEarned,
      prismaWallet.lifetimeRedeemed,
      prismaWallet.lifetimeExpired,
      prismaWallet.lifetimeRefunded,
      prismaWallet.createdAt,
      prismaWallet.updatedAt,
    );
  }

  static toPersistence(wallet: CoinWallet) {
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      lifetimeEarned: wallet.lifetimeEarned,
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
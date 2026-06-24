import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CoinTransactionRepository } from '../../../domain/repositories/coin-transaction.repository';

import { InvalidRedemptionException } from '../../../domain/exceptions/invalid-redemption.exception';

@Injectable()
export class GetCoinTransactionUseCase {
  constructor(
    @Inject(TOKENS.COIN_TRANSACTION_REPO)
    private readonly transactionRepo: CoinTransactionRepository,
  ) {}

  async execute(input: {
    transactionId: string;
  }) {
    const transaction =
      await this.transactionRepo.findById(
        input.transactionId,
      );

    if (!transaction) {
      throw new InvalidRedemptionException({
        message:
          'Coin transaction not found',
      });
    }

    return {
      id: transaction.id,

      walletId: transaction.walletId,

      userId: transaction.userId,

      type: transaction.type,

      status: transaction.status,

      sourceType:
        transaction.sourceType,

      coins: transaction.coins,

      balanceBefore:
        transaction.balanceBefore,

      balanceAfter:
        transaction.balanceAfter,

      orderId: transaction.orderId,

      paymentId: transaction.paymentId,

      redemptionId:
        transaction.redemptionId,

      description:
        transaction.description,

      metadata: transaction.metadata,

      expiresAt:
        transaction.expiresAt,

      expiredAt:
        transaction.expiredAt,

      remainingCoins:
        transaction.remainingCoins,

      createdByAdminId:
        transaction.createdByAdminId,

      idempotencyKey:
        transaction.idempotencyKey,

      createdAt: transaction.createdAt,


      isExpired:
        !!transaction.expiredAt,

      isPending:
        transaction.status ===
        'PENDING',

      isSuccessful:
        transaction.status ===
        'SUCCESS',
    };
  }
}
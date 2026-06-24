import {
  CoinTransaction as PrismaCoinTransaction,
  CoinTransactionStatus as PrismaCoinTransactionStatus,
  CoinTransactionType as PrismaCoinTransactionType,
  RewardSourceType as PrismaRewardSourceType,
} from '@prisma/client';

import { Prisma } from '@prisma/client';

import { CoinTransaction } from '../../../../domain/entities/coin-transaction.entity';

import { CoinTransactionStatus } from '../../../../domain/enums/coin-transaction-status.enum';
import { CoinTransactionType } from '../../../../domain/enums/coin-transaction-type.enum';
import { RewardSourceType } from '../../../../domain/enums/reward-source-type.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CoinTransactionMapper {
  private static toDomainType(type: PrismaCoinTransactionType): CoinTransactionType {
    switch (type) {
      case PrismaCoinTransactionType.EARNED:
        return CoinTransactionType.EARNED;

      case PrismaCoinTransactionType.BONUS:
        return CoinTransactionType.BONUS;

      case PrismaCoinTransactionType.REDEEMED:
        return CoinTransactionType.REDEEMED;

      case PrismaCoinTransactionType.REDEEM_REVERSED:
        return CoinTransactionType.REDEEM_REVERSED;

      case PrismaCoinTransactionType.REFUNDED:
        return CoinTransactionType.REFUNDED;

      case PrismaCoinTransactionType.ORDER_REWARD_REVERSED:
        return CoinTransactionType.ORDER_REWARD_REVERSED;

      case PrismaCoinTransactionType.EXPIRED:
        return CoinTransactionType.EXPIRED;

      case PrismaCoinTransactionType.ADMIN_CREDIT:
        return CoinTransactionType.ADMIN_CREDIT;

      case PrismaCoinTransactionType.ADMIN_DEBIT:
        return CoinTransactionType.ADMIN_DEBIT;

      case PrismaCoinTransactionType.ADJUSTED:
        return CoinTransactionType.ADJUSTED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma coin transaction type', value: type, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaType(type: CoinTransactionType): PrismaCoinTransactionType {
    switch (type) {
      case CoinTransactionType.EARNED:
        return PrismaCoinTransactionType.EARNED;

      case CoinTransactionType.BONUS:
        return PrismaCoinTransactionType.BONUS;

      case CoinTransactionType.REDEEMED:
        return PrismaCoinTransactionType.REDEEMED;

      case CoinTransactionType.REDEEM_REVERSED:
        return PrismaCoinTransactionType.REDEEM_REVERSED;

      case CoinTransactionType.REFUNDED:
        return PrismaCoinTransactionType.REFUNDED;

      case CoinTransactionType.ORDER_REWARD_REVERSED:
        return PrismaCoinTransactionType.ORDER_REWARD_REVERSED;

      case CoinTransactionType.EXPIRED:
        return PrismaCoinTransactionType.EXPIRED;

      case CoinTransactionType.ADMIN_CREDIT:
        return PrismaCoinTransactionType.ADMIN_CREDIT;

      case CoinTransactionType.ADMIN_DEBIT:
        return PrismaCoinTransactionType.ADMIN_DEBIT;

      case CoinTransactionType.ADJUSTED:
        return PrismaCoinTransactionType.ADJUSTED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain coin transaction type', value: type, direction: 'domain_to_prisma' });
    }
  }

  private static toDomainStatus(status: PrismaCoinTransactionStatus): CoinTransactionStatus {
    switch (status) {
      case PrismaCoinTransactionStatus.PENDING:
        return CoinTransactionStatus.PENDING;

      case PrismaCoinTransactionStatus.SUCCESS:
        return CoinTransactionStatus.SUCCESS;

      case PrismaCoinTransactionStatus.FAILED:
        return CoinTransactionStatus.FAILED;

      case PrismaCoinTransactionStatus.CANCELLED:
        return CoinTransactionStatus.CANCELLED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma coin transaction status', value: status, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaStatus(status: CoinTransactionStatus): PrismaCoinTransactionStatus {
    switch (status) {
      case CoinTransactionStatus.PENDING:
        return PrismaCoinTransactionStatus.PENDING;

      case CoinTransactionStatus.SUCCESS:
        return PrismaCoinTransactionStatus.SUCCESS;

      case CoinTransactionStatus.FAILED:
        return PrismaCoinTransactionStatus.FAILED;

      case CoinTransactionStatus.CANCELLED:
        return PrismaCoinTransactionStatus.CANCELLED;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain coin transaction status', value: status, direction: 'domain_to_prisma' });
    }
  }

  private static toDomainSourceType(
    sourceType?: PrismaRewardSourceType | null,
  ): RewardSourceType | undefined {
    if (!sourceType) {
      return undefined;
    }

    switch (sourceType) {
      case PrismaRewardSourceType.ORDER:
        return RewardSourceType.ORDER;

      case PrismaRewardSourceType.REDEMPTION:
        return RewardSourceType.REDEMPTION;

      case PrismaRewardSourceType.REFERRAL:
        return RewardSourceType.REFERRAL;

      case PrismaRewardSourceType.CAMPAIGN:
        return RewardSourceType.CAMPAIGN;

      case PrismaRewardSourceType.ADMIN:
        return RewardSourceType.ADMIN;

      case PrismaRewardSourceType.REFUND:
        return RewardSourceType.REFUND;

      case PrismaRewardSourceType.SYSTEM:
        return RewardSourceType.SYSTEM;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma reward source type', value: sourceType, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaSourceType(
    sourceType?: RewardSourceType,
  ): PrismaRewardSourceType | undefined {
    if (!sourceType) {
      return undefined;
    }

    switch (sourceType) {
      case RewardSourceType.ORDER:
        return PrismaRewardSourceType.ORDER;

      case RewardSourceType.REDEMPTION:
        return PrismaRewardSourceType.REDEMPTION;

      case RewardSourceType.REFERRAL:
        return PrismaRewardSourceType.REFERRAL;

      case RewardSourceType.CAMPAIGN:
        return PrismaRewardSourceType.CAMPAIGN;

      case RewardSourceType.ADMIN:
        return PrismaRewardSourceType.ADMIN;

      case RewardSourceType.REFUND:
        return PrismaRewardSourceType.REFUND;

      case RewardSourceType.SYSTEM:
        return PrismaRewardSourceType.SYSTEM;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain reward source type', value: sourceType, direction: 'domain_to_prisma' });
    }
  }

  static toDomain(prismaTransaction: PrismaCoinTransaction): CoinTransaction {
    return new CoinTransaction(
      prismaTransaction.id,
      prismaTransaction.walletId,
      prismaTransaction.userId,
      this.toDomainType(prismaTransaction.type),
      this.toDomainStatus(prismaTransaction.status),
      prismaTransaction.coins,
      prismaTransaction.balanceBefore,
      prismaTransaction.balanceAfter,
      this.toDomainSourceType(prismaTransaction.sourceType)!,
      prismaTransaction.orderId ?? undefined,
      prismaTransaction.paymentId ?? undefined,
      prismaTransaction.redemptionId ?? undefined,
      prismaTransaction.description ?? undefined,
      (prismaTransaction.metadata as Record<string, unknown> | undefined) ?? undefined,
      prismaTransaction.expiresAt ?? undefined,
      prismaTransaction.expiredAt ?? undefined,
      prismaTransaction.remainingCoins ?? undefined,
      prismaTransaction.createdByAdminId ?? undefined,
      prismaTransaction.idempotencyKey ?? undefined,
      prismaTransaction.createdAt,
    );
  }

  static toPersistence(transaction: CoinTransaction) {
    return {
      id: transaction.id,
      walletId: transaction.walletId,
      userId: transaction.userId,
      orderId: transaction.orderId ?? null,
      paymentId: transaction.paymentId ?? null,
      redemptionId: transaction.redemptionId ?? null,
      type: this.toPrismaType(transaction.type),
      status: this.toPrismaStatus(transaction.status),
      coins: transaction.coins,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      description: transaction.description ?? null,
      sourceType: this.toPrismaSourceType(transaction.sourceType) ?? null,
      idempotencyKey: transaction.idempotencyKey ?? null,
      expiresAt: transaction.expiresAt ?? null,
      expiredAt: transaction.expiredAt ?? null,

      // FIXED HERE
      remainingCoins: transaction.remainingCoins ?? undefined,

      createdByAdminId: transaction.createdByAdminId ?? null,
      metadata: transaction.metadata ? (transaction.metadata as Prisma.InputJsonValue) : undefined,
      createdAt: transaction.createdAt,
    };
  }
}

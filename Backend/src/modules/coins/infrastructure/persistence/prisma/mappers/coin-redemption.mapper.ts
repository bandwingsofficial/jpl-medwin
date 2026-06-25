import {
  CoinRedemption as PrismaCoinRedemption,
  CoinRedemptionStatus as PrismaCoinRedemptionStatus,
} from '@prisma/client';

import { Prisma } from '@prisma/client';

import { CoinRedemption } from '../../../../domain/entities/coin-redemption.entity';

import { CoinRedemptionStatus } from '../../../../domain/enums/coin-redemption-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CoinRedemptionMapper {
  private static toDomainStatus(status: PrismaCoinRedemptionStatus): CoinRedemptionStatus {
    switch (status) {
      case PrismaCoinRedemptionStatus.PENDING:
        return CoinRedemptionStatus.PENDING;

      case PrismaCoinRedemptionStatus.APPLIED:
        return CoinRedemptionStatus.APPLIED;

      case PrismaCoinRedemptionStatus.REVERSED:
        return CoinRedemptionStatus.REVERSED;

      case PrismaCoinRedemptionStatus.FAILED:
        return CoinRedemptionStatus.FAILED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Prisma redemption status',
          value: status,
          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaStatus(status: CoinRedemptionStatus): PrismaCoinRedemptionStatus {
    switch (status) {
      case CoinRedemptionStatus.PENDING:
        return PrismaCoinRedemptionStatus.PENDING;

      case CoinRedemptionStatus.APPLIED:
        return PrismaCoinRedemptionStatus.APPLIED;

      case CoinRedemptionStatus.REVERSED:
        return PrismaCoinRedemptionStatus.REVERSED;

      case CoinRedemptionStatus.FAILED:
        return PrismaCoinRedemptionStatus.FAILED;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown Domain redemption status',
          value: status,
          direction: 'domain_to_prisma',
        });
    }
  }

  static toDomain(prismaRedemption: PrismaCoinRedemption): CoinRedemption {
    return new CoinRedemption(
      prismaRedemption.id,
      prismaRedemption.userId,
      prismaRedemption.walletId,
      prismaRedemption.orderId,
      this.toDomainStatus(prismaRedemption.status),
      prismaRedemption.redeemedCoins,
      Number(prismaRedemption.redeemedAmount),
      prismaRedemption.reversedAt ?? undefined,
      prismaRedemption.reversalReason ?? undefined,
      prismaRedemption.createdAt,
      prismaRedemption.updatedAt,
    );
  }

  static toPersistence(redemption: CoinRedemption) {
    return {
      id: redemption.id,
      userId: redemption.userId,
      walletId: redemption.walletId,
      orderId: redemption.orderId,
      status: this.toPrismaStatus(redemption.status),
      redeemedCoins: redemption.redeemedCoins,
      redeemedAmount: new Prisma.Decimal(redemption.redeemedAmount),
      reversedAt: redemption.reversedAt ?? null,
      reversalReason: redemption.reversalReason ?? null,
      createdAt: redemption.createdAt,
      updatedAt: redemption.updatedAt,
    };
  }
}

import {
  Prisma,
  RewardTier as PrismaRewardTier,
  RewardTierStatus as PrismaRewardTierStatus,
} from '@prisma/client';

import { RewardTier } from '../../../../domain/entities/reward-tier.entity';

import { RewardTierStatus } from '../../../../domain/enums/reward-tier-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class RewardTierMapper {
  private static toDomainStatus(status: PrismaRewardTierStatus): RewardTierStatus {
    switch (status) {
      case PrismaRewardTierStatus.ACTIVE:
        return RewardTierStatus.ACTIVE;

      case PrismaRewardTierStatus.INACTIVE:
        return RewardTierStatus.INACTIVE;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma reward tier status', value: status, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaStatus(status: RewardTierStatus): PrismaRewardTierStatus {
    switch (status) {
      case RewardTierStatus.ACTIVE:
        return PrismaRewardTierStatus.ACTIVE;

      case RewardTierStatus.INACTIVE:
        return PrismaRewardTierStatus.INACTIVE;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain reward tier status', value: status, direction: 'domain_to_prisma' });
    }
  }

  static toDomain(prismaTier: PrismaRewardTier): RewardTier {
    return new RewardTier(
      prismaTier.id,
      prismaTier.name,
      this.toDomainStatus(prismaTier.status),
      Number(prismaTier.coinMultiplier),
      Number(prismaTier.minimumLifetimeSpend),
      prismaTier.description ?? undefined,
      prismaTier.badgeImage ?? undefined,
      prismaTier.createdAt,
      prismaTier.updatedAt,
    );
  }

  static toPersistence(tier: RewardTier) {
    return {
      id: tier.id,
      name: tier.name,
      description: tier.description ?? null,
      status: this.toPrismaStatus(tier.status),
      coinMultiplier: new Prisma.Decimal(tier.coinMultiplier),
      minimumLifetimeSpend: new Prisma.Decimal(tier.minimumLifetimeSpend),
      badgeImage: tier.badgeImage ?? null,
      createdAt: tier.createdAt,
      updatedAt: tier.updatedAt,
    };
  }
}

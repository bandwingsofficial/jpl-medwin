import { Prisma, RewardConfig as PrismaRewardConfig } from '@prisma/client';

import { RewardConfig } from '../../../../domain/entities/reward-config.entity';

export class RewardConfigMapper {
  static toDomain(prismaConfig: PrismaRewardConfig): RewardConfig {
    return new RewardConfig(
      prismaConfig.id,
      Number(prismaConfig.earnRateAmount),
      prismaConfig.earnRateCoins,
      Number(prismaConfig.coinValue),
      Number(prismaConfig.maxRedemptionPercentage),
      prismaConfig.minimumOrderAmount ? Number(prismaConfig.minimumOrderAmount) : undefined,
      prismaConfig.expiryMonths,
      prismaConfig.rewardOnDelivered,
      prismaConfig.isActive,
      prismaConfig.createdAt,
      prismaConfig.updatedAt,
    );
  }

  static toPersistence(config: RewardConfig) {
    return {
      id: config.id,
      earnRateAmount: new Prisma.Decimal(config.earnRateAmount),
      earnRateCoins: config.earnRateCoins,
      coinValue: new Prisma.Decimal(config.coinValue),
      maxRedemptionPercentage: new Prisma.Decimal(config.maxRedemptionPercentage),
      minimumOrderAmount:
        config.minimumOrderAmount !== undefined
          ? new Prisma.Decimal(config.minimumOrderAmount)
          : null,
      expiryMonths: config.expiryMonths,
      rewardOnDelivered: config.rewardOnDelivered,
      isActive: config.isActive,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    };
  }
}

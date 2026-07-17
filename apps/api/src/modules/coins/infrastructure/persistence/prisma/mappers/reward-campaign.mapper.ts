import { Prisma, RewardCampaign as PrismaRewardCampaign } from '@prisma/client';

import { RewardCampaign } from '../../../../domain/entities/reward-campaign.entity';

export class RewardCampaignMapper {
  static toDomain(prismaCampaign: PrismaRewardCampaign): RewardCampaign {
    return new RewardCampaign(
      prismaCampaign.id,
      prismaCampaign.title,
      Number(prismaCampaign.bonusMultiplier),
      prismaCampaign.startsAt,
      prismaCampaign.endsAt,
      prismaCampaign.isActive,
      prismaCampaign.description ?? undefined,
      (prismaCampaign.metadata as Record<string, unknown> | undefined) ?? undefined,
      prismaCampaign.createdAt,
      prismaCampaign.updatedAt,
    );
  }

  static toPersistence(campaign: RewardCampaign) {
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description ?? null,
      bonusMultiplier: new Prisma.Decimal(campaign.bonusMultiplier),
      startsAt: campaign.startsAt,
      endsAt: campaign.endsAt,
      isActive: campaign.isActive,
      metadata: campaign.metadata ? (campaign.metadata as Prisma.InputJsonValue) : undefined,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    };
  }
}

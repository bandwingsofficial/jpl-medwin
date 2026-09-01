import { Prisma } from '@prisma/client';

import { RewardCampaign } from '../entities/reward-campaign.entity';

export interface RewardCampaignRepository {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<RewardCampaign | null>;

  findAll(tx?: Prisma.TransactionClient): Promise<RewardCampaign[]>;

  findActiveCampaigns(tx?: Prisma.TransactionClient): Promise<RewardCampaign[]>;

  findCurrentCampaigns(tx?: Prisma.TransactionClient): Promise<RewardCampaign[]>;

  findExpiredCampaigns(tx?: Prisma.TransactionClient): Promise<RewardCampaign[]>;

  findUpcomingCampaigns(tx?: Prisma.TransactionClient): Promise<RewardCampaign[]>;

  findLatest(limit?: number, tx?: Prisma.TransactionClient): Promise<RewardCampaign[]>;

  existsById(id: string, tx?: Prisma.TransactionClient): Promise<boolean>;

  create(campaign: RewardCampaign, tx?: Prisma.TransactionClient): Promise<RewardCampaign>;

  update(campaign: RewardCampaign, tx?: Prisma.TransactionClient): Promise<RewardCampaign>;

  activate(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  deactivate(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  delete(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

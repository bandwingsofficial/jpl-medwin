import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class RewardCampaignNotFoundException extends BaseException {
  constructor(details?: { campaignId?: string; message?: string }) {
    super(
      details?.message || 'Reward campaign not found',
      ErrorCode.COINS.REWARD_CAMPAIGN_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

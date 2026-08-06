import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class RewardTierNotFoundException extends BaseException {
  constructor(details?: { rewardTierId?: string; name?: string; message?: string }) {
    super(
      details?.message || 'Reward tier not found',
      ErrorCode.COINS.REWARD_TIER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

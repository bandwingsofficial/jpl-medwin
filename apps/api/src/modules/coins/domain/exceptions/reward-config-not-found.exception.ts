import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class RewardConfigNotFoundException extends BaseException {
  constructor(details?: { rewardConfigId?: string; message?: string }) {
    super(
      details?.message || 'Reward configuration not found',
      ErrorCode.COINS.REWARD_CONFIG_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InactiveRewardConfigException extends BaseException {
  constructor(details?: { rewardConfigId?: string; message?: string }) {
    super(
      details?.message || 'Reward configuration is inactive',
      ErrorCode.COINS.INACTIVE_REWARD_CONFIG,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

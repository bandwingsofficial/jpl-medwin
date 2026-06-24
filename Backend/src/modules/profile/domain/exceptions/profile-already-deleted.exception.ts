// src/modules/profile/domain/exceptions/profile-already-deleted.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ProfileAlreadyDeletedException extends BaseException {
  constructor(details?: { profileId?: string }) {
    super(
      'Profile already deleted',
      ErrorCode.PROFILE.ALREADY_DELETED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

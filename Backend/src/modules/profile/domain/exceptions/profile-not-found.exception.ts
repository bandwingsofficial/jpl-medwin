// src/modules/profile/domain/exceptions/profile-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ProfileNotFoundException extends BaseException {
  constructor(details?: { profileId?: string; userId?: string }) {
    super('Profile not found', ErrorCode.PROFILE.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

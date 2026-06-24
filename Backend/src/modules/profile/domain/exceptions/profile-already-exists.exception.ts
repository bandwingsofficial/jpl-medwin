// src/modules/profile/domain/exceptions/profile-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ProfileAlreadyExistsException extends BaseException {
  constructor(details?: { userId?: string }) {
    super('Profile already exists', ErrorCode.PROFILE.ALREADY_EXISTS, HttpStatus.CONFLICT, details);
  }
}

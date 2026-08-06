// src/modules/profile/application/exceptions/email-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class EmailAlreadyExistsException extends BaseException {
  constructor(details?: { email?: string }) {
    super(
      'Email already exists',
      ErrorCode.PROFILE.EMAIL_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

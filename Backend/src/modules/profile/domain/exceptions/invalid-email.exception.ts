// src/modules/profile/application/exceptions/invalid-email.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidEmailException extends BaseException {
  constructor(details?: { email?: string }) {
    super(
      'Invalid email',
      ErrorCode.PROFILE.INVALID_EMAIL,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
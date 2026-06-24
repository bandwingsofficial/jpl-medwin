// src/modules/profile/application/exceptions/invalid-phone-number.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidPhoneNumberException extends BaseException {
  constructor(details?: { phoneNumber?: string }) {
    super(
      'Invalid phone number',
      ErrorCode.PROFILE.INVALID_PHONE_NUMBER,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}


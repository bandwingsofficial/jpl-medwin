// src/modules/profile/application/exceptions/phone-number-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class PhoneNumberAlreadyExistsException extends BaseException {
  constructor(details?: { phoneNumber?: string }) {
    super(
      'Phone number already exists',
      ErrorCode.PROFILE.PHONE_NUMBER_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
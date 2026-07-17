// src/modules/saved-address/domain/exceptions/home-address-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class HomeAddressAlreadyExistsException extends BaseException {
  constructor(details?: { userId?: string }) {
    super(
      'Home address already exists',
      ErrorCode.SAVED_ADDRESS.HOME_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

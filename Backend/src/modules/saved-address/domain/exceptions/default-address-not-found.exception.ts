// src/modules/saved-address/domain/exceptions/default-address-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class DefaultAddressNotFoundException extends BaseException {
  constructor(details?: { userId?: string }) {
    super(
      'Default address not found',
      ErrorCode.SAVED_ADDRESS.DEFAULT_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

// src/modules/saved-address/domain/exceptions/invalid-address-type.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidAddressTypeException extends BaseException {
  constructor(details?: { type?: string }) {
    super(
      'Invalid address type',
      ErrorCode.SAVED_ADDRESS.INVALID_TYPE,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

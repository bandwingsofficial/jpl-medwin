// src/modules/saved-address/domain/exceptions/address-already-deleted.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class AddressAlreadyDeletedException extends BaseException {
  constructor(details?: { addressId?: string }) {
    super(
      'Address already deleted',
      ErrorCode.SAVED_ADDRESS.ALREADY_DELETED,
      HttpStatus.GONE,
      details,
    );
  }
}

// src/modules/saved-address/domain/exceptions/address-access-denied.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class AddressAccessDeniedException extends BaseException {
  constructor(details?: { addressId?: string; userId?: string }) {
    super(
      'Access denied for this address',
      ErrorCode.SAVED_ADDRESS.ACCESS_DENIED,
      HttpStatus.FORBIDDEN,
      details,
    );
  }
}

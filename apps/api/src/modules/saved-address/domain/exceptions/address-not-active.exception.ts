// src/modules/saved-address/domain/exceptions/address-not-active.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class AddressNotActiveException extends BaseException {
  constructor(details?: { addressId?: string }) {
    super(
      'Address is not active',
      ErrorCode.SAVED_ADDRESS.NOT_ACTIVE,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

// src/modules/saved-address/domain/exceptions/address-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class AddressNotFoundException extends BaseException {
  constructor(details?: { addressId?: string }) {
    super('Address not found', ErrorCode.SAVED_ADDRESS.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

// src/modules/saved-address/domain/exceptions/invalid-address.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidAddressException extends BaseException {
  constructor(details?: any) {
    super('Invalid address', ErrorCode.SAVED_ADDRESS.INVALID, HttpStatus.BAD_REQUEST, details);
  }
}

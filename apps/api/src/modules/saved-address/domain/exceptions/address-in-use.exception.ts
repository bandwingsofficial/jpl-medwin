import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class AddressInUseException extends BaseException {
  constructor(details?: { addressId?: string; orderCount?: number }) {
    super(
      'Address is already used by existing orders.',
      ErrorCode.SAVED_ADDRESS.IN_USE,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

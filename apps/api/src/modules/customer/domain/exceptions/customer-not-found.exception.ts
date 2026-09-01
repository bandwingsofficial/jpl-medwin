// src/modules/customer/domain/exceptions/customer-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CustomerNotFoundException extends BaseException {
  constructor(details?: { userId?: string }) {
    super(
      'Customer not found',

      ErrorCode.CUSTOMER.NOT_FOUND,

      HttpStatus.NOT_FOUND,

      details,
    );
  }
}

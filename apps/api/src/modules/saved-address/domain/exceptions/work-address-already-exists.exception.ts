// src/modules/saved-address/domain/exceptions/work-address-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class WorkAddressAlreadyExistsException extends BaseException {
  constructor(details?: { userId?: string }) {
    super(
      'Work address already exists',
      ErrorCode.SAVED_ADDRESS.WORK_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

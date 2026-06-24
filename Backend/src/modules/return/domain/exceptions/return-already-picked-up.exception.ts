import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnAlreadyPickedUpException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super(
      'Return already picked up',
      ErrorCode.RETURN.ALREADY_PICKED_UP,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
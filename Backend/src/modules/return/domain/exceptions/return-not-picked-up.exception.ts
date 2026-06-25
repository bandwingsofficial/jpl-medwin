import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ReturnNotPickedUpException extends BaseException {
  constructor(details?: { returnId?: string }) {
    super(
      'Return item has not been picked up',
      ErrorCode.RETURN.NOT_PICKED_UP,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

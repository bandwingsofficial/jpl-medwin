import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidProductImageOwnerException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'Invalid image owner type',
      ErrorCode.PRODUCT_IMAGE.INVALID_OWNER,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

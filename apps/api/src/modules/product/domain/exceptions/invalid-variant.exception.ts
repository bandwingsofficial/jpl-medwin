import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidVariantException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Invalid variant data', ErrorCode.VARIANT.INVALID, HttpStatus.BAD_REQUEST, details);
  }
}

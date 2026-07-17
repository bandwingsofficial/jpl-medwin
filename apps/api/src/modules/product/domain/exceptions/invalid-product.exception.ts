import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidProductException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Invalid product data', ErrorCode.PRODUCT.INVALID, HttpStatus.BAD_REQUEST, details);
  }
}

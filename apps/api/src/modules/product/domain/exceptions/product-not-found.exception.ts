import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ProductNotFoundException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Product not found', ErrorCode.PRODUCT.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ProductInactiveException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Product is inactive', ErrorCode.PRODUCT.INACTIVE, HttpStatus.BAD_REQUEST, details);
  }
}

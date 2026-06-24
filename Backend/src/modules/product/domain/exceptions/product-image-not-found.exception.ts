import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ProductImageNotFoundException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'Product image not found',
      ErrorCode.PRODUCT_IMAGE.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

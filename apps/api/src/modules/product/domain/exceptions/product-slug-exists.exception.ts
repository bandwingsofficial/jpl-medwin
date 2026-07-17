import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class ProductSlugExistsException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'Product slug already exists',
      ErrorCode.PRODUCT.SLUG_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

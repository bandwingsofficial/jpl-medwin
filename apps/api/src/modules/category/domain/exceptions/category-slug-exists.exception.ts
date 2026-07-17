import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CategorySlugExistsException extends BaseException {
  constructor(details?: { slug?: string }) {
    super(
      'Category slug already exists',
      ErrorCode.CATEGORY.SLUG_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

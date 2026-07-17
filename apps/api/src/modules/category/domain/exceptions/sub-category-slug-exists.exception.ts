import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class SubCategorySlugExistsException extends BaseException {
  constructor(details?: { slug?: string }) {
    super(
      'SubCategory slug already exists',
      ErrorCode.SUB_CATEGORY.SLUG_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

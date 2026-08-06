import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class MiniCategorySlugExistsException extends BaseException {
  constructor(details?: { slug?: string }) {
    super(
      'MiniCategory slug already exists',
      ErrorCode.MINI_CATEGORY.SLUG_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

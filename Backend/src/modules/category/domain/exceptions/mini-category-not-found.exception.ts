import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class MiniCategoryNotFoundException extends BaseException {
  constructor(details?: { miniCategoryId?: string; slug?: string }) {
    super(
      'MiniCategory not found',
      ErrorCode.CATEGORY.MINI_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

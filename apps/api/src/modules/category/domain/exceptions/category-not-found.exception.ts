import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CategoryNotFoundException extends BaseException {
  constructor(details?: { categoryId?: string; slug?: string }) {
    super('Category not found', ErrorCode.CATEGORY.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

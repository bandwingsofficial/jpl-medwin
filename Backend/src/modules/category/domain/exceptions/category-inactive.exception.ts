import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CategoryInactiveException extends BaseException {
  constructor(details?: { categoryId?: string; subCategoryId?: string; miniCategoryId?: string }) {
    super('Category is inactive', ErrorCode.CATEGORY.INACTIVE, HttpStatus.BAD_REQUEST, details);
  }
}

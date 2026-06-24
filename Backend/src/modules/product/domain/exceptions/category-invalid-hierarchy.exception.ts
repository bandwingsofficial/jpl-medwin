import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidCategoryHierarchyException extends BaseException {
  constructor(details?: { categoryId?: string; subCategoryId?: string; miniCategoryId?: string }) {
    super(
      'Invalid category hierarchy',
      ErrorCode.CATEGORY.INVALID_HIERARCHY,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

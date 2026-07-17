import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CategoryHasChildrenException extends BaseException {
  constructor(details?: { categoryId?: string; subCategoryId?: string; childrenCount?: number }) {
    const countText = details?.childrenCount ? ` It has ${details.childrenCount} child items.` : '';

    super(
      `Cannot delete because it has existing children.${countText}`,
      ErrorCode.CATEGORY.HAS_CHILDREN,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

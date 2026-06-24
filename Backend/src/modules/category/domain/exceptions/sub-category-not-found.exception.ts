import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class SubCategoryNotFoundException extends BaseException {
  constructor(details?: { subCategoryId?: string; slug?: string }) {
    super('SubCategory not found', ErrorCode.CATEGORY.SUB_NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

// src/modules/brand/domain/exceptions/brand-already-deleted.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class BrandAlreadyDeletedException extends BaseException {
  constructor(details?: { brandId?: string }) {
    super('Brand already deleted', ErrorCode.BRAND.ALREADY_DELETED, HttpStatus.GONE, details);
  }
}

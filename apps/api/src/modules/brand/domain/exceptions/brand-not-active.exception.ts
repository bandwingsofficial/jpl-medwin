// src/modules/brand/domain/exceptions/brand-not-active.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class BrandNotActiveException extends BaseException {
  constructor(details?: { brandId?: string }) {
    super('Brand is not active', ErrorCode.BRAND.NOT_ACTIVE, HttpStatus.BAD_REQUEST, details);
  }
}

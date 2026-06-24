// src/modules/brand/domain/exceptions/invalid-brand.exception.ts

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidBrandException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Invalid brand data', ErrorCode.BRAND.INVALID, HttpStatus.BAD_REQUEST, details);
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class BrandNotFoundException extends BaseException {
  constructor(details?: { brandId?: string; slug?: string }) {
    super('Brand not found', ErrorCode.BRAND.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

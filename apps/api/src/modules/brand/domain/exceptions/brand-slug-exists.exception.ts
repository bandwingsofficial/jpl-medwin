import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class BrandSlugExistsException extends BaseException {
  constructor(details?: { slug: string }) {
    super('Brand slug already exists', ErrorCode.BRAND.SLUG_EXISTS, HttpStatus.CONFLICT, details);
  }
}

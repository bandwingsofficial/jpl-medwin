import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class VariantNotFoundException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Variant not found', ErrorCode.VARIANT.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

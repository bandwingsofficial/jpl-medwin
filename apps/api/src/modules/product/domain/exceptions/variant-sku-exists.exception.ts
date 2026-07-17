import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class VariantSkuExistsException extends BaseException {
  constructor(details?: Record<string, any>) {
    super('Variant SKU already exists', ErrorCode.VARIANT.SKU_EXISTS, HttpStatus.CONFLICT, details);
  }
}

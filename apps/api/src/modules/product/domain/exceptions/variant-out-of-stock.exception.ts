import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class VariantOutOfStockException extends BaseException {
  constructor(details?: Record<string, any>) {
    super(
      'Variant is out of stock',
      ErrorCode.VARIANT.OUT_OF_STOCK,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

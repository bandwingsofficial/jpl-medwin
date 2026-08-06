import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class ProductNameVO {
  private readonly value: string;

  constructor(input: string) {
    const normalized = input?.trim();

    if (!normalized || normalized.length < 2) {
      throw new BaseException(
        'Invalid product name',
        ErrorCode.PRODUCT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (normalized.length > 150) {
      throw new BaseException(
        'Product name too long',
        ErrorCode.PRODUCT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }
}

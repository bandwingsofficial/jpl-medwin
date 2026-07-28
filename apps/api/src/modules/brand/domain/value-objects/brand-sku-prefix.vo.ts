import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class BrandSkuPrefixVO {
  private readonly value: string;

  constructor(input: string) {
    const normalized = input?.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (!normalized || normalized.length < 2 || normalized.length > 6) {
      throw new BaseException(
        'SKU Prefix must be 2-6 uppercase alphanumeric characters',
        ErrorCode.BRAND.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!/^[A-Z0-9]{2,6}$/.test(normalized)) {
      throw new BaseException(
        'SKU Prefix format invalid',
        ErrorCode.BRAND.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }
}

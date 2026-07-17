import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class SkuVO {
  private readonly value: string;

  constructor(input: string) {
    const normalized = input?.trim().toUpperCase();

    if (!normalized || normalized.length < 3) {
      throw new BaseException('Invalid SKU', ErrorCode.VARIANT.INVALID, HttpStatus.BAD_REQUEST);
    }

    if (!/^[A-Z0-9-_]+$/.test(normalized)) {
      throw new BaseException(
        'SKU format invalid',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }
}

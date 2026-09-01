import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class PriceVO {
  private readonly value: number;

  constructor(input: number) {
    if (input == null || isNaN(input)) {
      throw new BaseException('Invalid price', ErrorCode.VARIANT.INVALID, HttpStatus.BAD_REQUEST);
    }

    if (input < 0) {
      throw new BaseException(
        'Price cannot be negative',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (input > 10_000_000) {
      throw new BaseException('Price too large', ErrorCode.VARIANT.INVALID, HttpStatus.BAD_REQUEST);
    }

    this.value = Number(input.toFixed(2));
  }

  getValue(): number {
    return this.value;
  }
}

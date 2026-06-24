import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';
export class QuantityVO {
  private readonly value: number;

  constructor(input: number) {
    if (!Number.isInteger(input) || input < 0) {
      throw new BaseException(
        'Invalid quantity',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = input;
  }

  getValue(): number {
    return this.value;
  }
}

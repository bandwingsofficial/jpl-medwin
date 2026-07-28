import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class QuantityVO {
  private readonly value: number;

  constructor(input?: number | null) {
    if (input === undefined || input === null) {
      this.value = 0;
      return;
    }

    const parsed = Number(input);

    if (!Number.isInteger(parsed) || parsed < 0) {
      throw new BaseException(
        'Invalid quantity',
        ErrorCode.VARIANT.INVALID,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = parsed;
  }

  getValue(): number {
    return this.value;
  }
}

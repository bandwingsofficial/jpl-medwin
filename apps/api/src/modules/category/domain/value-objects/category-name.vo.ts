import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class CategoryNameVO {
  private readonly value: string;

  constructor(name: string) {
    const normalized = name.trim();

    if (normalized.length < 2 || normalized.length > 100) {
      throw new BaseException(
        'Invalid category name',
        ErrorCode.VALIDATION.INVALID_CATEGORY_NAME,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: CategoryNameVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class BrandNameVO {
  private readonly value: string;

  constructor(name: string) {
    const normalized = name.trim().replace(/\s+/g, ' ').toLowerCase();

    if (normalized.length < 2 || normalized.length > 100) {
      throw new BaseException(
        'Invalid brand name',
        ErrorCode.VALIDATION.INVALID_BRAND_NAME,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: BrandNameVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

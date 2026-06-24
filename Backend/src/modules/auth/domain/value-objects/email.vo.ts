import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class EmailVO {
  private readonly value: string;

  constructor(email: string) {
    const normalized = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new BaseException(
        'Invalid email',
        ErrorCode.VALIDATION.INVALID_EMAIL,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: EmailVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

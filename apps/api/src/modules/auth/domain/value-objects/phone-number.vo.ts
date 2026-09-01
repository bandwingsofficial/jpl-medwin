import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class PhoneNumberVO {
  private readonly value: string;

  constructor(phone: string) {
    const normalized = phone.trim().replace(/\s+/g, '');

    // 🇮🇳 Indian format (basic)
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(normalized)) {
      throw new BaseException(
        'Invalid phone number',
        ErrorCode.VALIDATION.INVALID_PHONE_NUMBER,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: PhoneNumberVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

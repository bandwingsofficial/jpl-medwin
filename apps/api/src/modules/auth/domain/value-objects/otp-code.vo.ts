import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';
import { OTP_POLICY } from '@/domain/policies/otp.policy';

export class OtpCodeVO {
  private readonly value: string;

  constructor(code: string) {
    const normalized = code.trim();

    const otpRegex = new RegExp(`^\\d{${OTP_POLICY.LENGTH}}$`);

    if (!otpRegex.test(normalized)) {
      throw new BaseException(
        'Invalid OTP format',
        ErrorCode.VALIDATION.INVALID_OTP_FORMAT,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.value = normalized;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: OtpCodeVO): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}

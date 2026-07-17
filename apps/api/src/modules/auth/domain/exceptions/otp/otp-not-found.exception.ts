import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OtpNotFoundException extends BaseException {
  constructor(details?: { identifier?: string; purpose?: string }) {
    super('OTP not found', ErrorCode.OTP.NOT_FOUND, HttpStatus.BAD_REQUEST, details);
  }
}

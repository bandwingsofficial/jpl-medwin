import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OtpExpiredException extends BaseException {
  constructor(details?: { identifier?: string; purpose?: string }) {
    super('OTP expired', ErrorCode.OTP.EXPIRED, HttpStatus.BAD_REQUEST, details);
  }
}

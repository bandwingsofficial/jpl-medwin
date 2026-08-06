import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class IdentityTotpNotEnabledException extends BaseException {
  constructor(details?: any) {
    super('TOTP not enabled for this identity', ErrorCode.IDENTITY.TOTP_NOT_ENABLED, 400, details);
  }
}

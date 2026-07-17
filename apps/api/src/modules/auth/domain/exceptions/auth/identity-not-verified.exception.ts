import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class IdentityNotVerifiedException extends BaseException {
  constructor(details?: { type?: string; value?: string }) {
    super('Identity not verified', ErrorCode.IDENTITY.NOT_VERIFIED, HttpStatus.FORBIDDEN, details);
  }
}

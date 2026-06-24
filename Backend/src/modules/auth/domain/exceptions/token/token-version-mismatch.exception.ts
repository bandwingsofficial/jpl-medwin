import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class TokenVersionMismatchException extends BaseException {
  constructor(details?: { userId?: string; tokenVersion?: number; currentVersion?: number }) {
    super(
      'Token version mismatch',
      ErrorCode.AUTH.TOKEN_VERSION_MISMATCH,
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { HttpStatus } from '@nestjs/common';

export class ChallengeExpiredException extends BaseException {
  constructor() {
    super(
      'Authentication session has expired. Please sign in again.',
      ErrorCode.AUTH.CHALLENGE_EXPIRED,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

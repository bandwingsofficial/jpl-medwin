import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class CannotLogoutCurrentSessionException extends BaseException {
  constructor(details?: { sessionId?: string }) {
    super(
      'Cannot logout current session. Use /auth/logout instead',
      ErrorCode.SESSION.CANNOT_LOGOUT_CURRENT,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { AuthMethod } from '@/domain/enums/auth-method.enum';

type IdentityDetails = {
  type?: AuthMethod;
  value?: string;
};

export class IdentityInactiveException extends BaseException {
  constructor(details?: IdentityDetails) {
    super(
      'Identity is inactive or deleted',
      ErrorCode.IDENTITY.INACTIVE,
      HttpStatus.UNAUTHORIZED,
      details,
    );
  }
}

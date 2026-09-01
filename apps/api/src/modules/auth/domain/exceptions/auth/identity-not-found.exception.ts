import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';
import { AuthMethod } from '@/domain/enums/auth-method.enum';

type IdentityDetails = {
  type?: AuthMethod;
  value?: string;
};

export class IdentityNotFoundException extends BaseException {
  constructor(details?: IdentityDetails) {
    super('Identity not found', ErrorCode.IDENTITY.NOT_FOUND, HttpStatus.NOT_FOUND, details);
  }
}

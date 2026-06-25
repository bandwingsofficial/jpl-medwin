import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidEnumMappingException extends BaseException {
  constructor(details?: {
    field?: string;
    value?: string;
    enumName?: string;
    allowedValues?: string[];
    direction?: 'prisma_to_domain' | 'domain_to_prisma';
  }) {
    super(
      'Invalid enum mapping',
      ErrorCode.SESSION.INVALID_ENUM_MAPPING,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class InvalidShippingConfigurationException extends BaseException {
  constructor(details?: { message?: string; field?: string }) {
    super(
      details?.message ?? 'Invalid shipping configuration',
      ErrorCode.SHIPPING_CONFIGURATION.INVALID,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

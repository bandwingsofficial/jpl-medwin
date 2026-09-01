import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class AtLeastOneActiveShippingConfigurationRequiredException extends BaseException {
  constructor(details?: { configurationId?: string }) {
    super(
      'At least one active shipping configuration is required.',
      ErrorCode.SHIPPING_CONFIGURATION.AT_LEAST_ONE_ACTIVE_REQUIRED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

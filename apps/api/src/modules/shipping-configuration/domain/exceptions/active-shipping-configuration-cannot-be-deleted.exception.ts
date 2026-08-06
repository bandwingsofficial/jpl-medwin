import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ActiveShippingConfigurationCannotBeDeletedException extends BaseException {
  constructor(details?: { configurationId?: string }) {
    super(
      'Active shipping configuration cannot be deleted. Activate another configuration first.',
      ErrorCode.SHIPPING_CONFIGURATION.ACTIVE_CANNOT_BE_DELETED,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

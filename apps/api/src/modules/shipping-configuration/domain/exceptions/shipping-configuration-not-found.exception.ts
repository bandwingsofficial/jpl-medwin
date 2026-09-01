import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class ShippingConfigurationNotFoundException extends BaseException {
  constructor(details?: { configurationId?: string }) {
    super(
      'Active shipping configuration not found',
      ErrorCode.SHIPPING_CONFIGURATION.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

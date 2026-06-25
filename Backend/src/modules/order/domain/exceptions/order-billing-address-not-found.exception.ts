import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OrderBillingAddressNotFoundException extends BaseException {
  constructor(details?: { addressId?: string; userId?: string }) {
    super(
      'Billing address not found',
      ErrorCode.ORDER.BILLING_ADDRESS_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OrderShippingAddressNotFoundException extends BaseException {
  constructor(details?: { addressId?: string; userId?: string }) {
    super(
      'Shipping address not found',
      ErrorCode.ORDER.SHIPPING_ADDRESS_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}

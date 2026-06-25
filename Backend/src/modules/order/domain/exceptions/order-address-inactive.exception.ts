import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OrderAddressInactiveException extends BaseException {
  constructor(details?: { addressId?: string }) {
    super(
      'Address is inactive or deleted',
      ErrorCode.ORDER.ADDRESS_INACTIVE,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class OrderAddressAccessDeniedException extends BaseException {
  constructor(details?: { addressId?: string; userId?: string }) {
    super(
      'Address does not belong to the current user',
      ErrorCode.ORDER.ADDRESS_ACCESS_DENIED,
      HttpStatus.FORBIDDEN,
      details,
    );
  }
}

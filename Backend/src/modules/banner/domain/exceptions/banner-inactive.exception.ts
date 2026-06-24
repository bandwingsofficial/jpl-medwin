import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class BannerInactiveException extends BaseException {
  constructor(details?: {
    bannerId?: string;
  }) {
    super(
      'Banner is inactive',
      ErrorCode.BANNER.INACTIVE,
      HttpStatus.BAD_REQUEST,
      details,
    );
  }
}
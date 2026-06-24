import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class BannerNotFoundException extends BaseException {
  constructor(details?: {
    bannerId?: string;
  }) {
    super(
      'Banner not found',
      ErrorCode.BANNER.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
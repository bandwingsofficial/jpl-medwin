import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class BannerImageNotFoundException extends BaseException {
  constructor(details?: {
    bannerImageId?: string;
  }) {
    super(
      'Banner image not found',
      ErrorCode.BANNER.IMAGE_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
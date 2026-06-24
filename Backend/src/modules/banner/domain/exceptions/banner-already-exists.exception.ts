import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class BannerAlreadyExistsException extends BaseException {
  constructor(details?: {
    name?: string;
  }) {
    super(
      'Banner already exists',
      ErrorCode.BANNER.ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
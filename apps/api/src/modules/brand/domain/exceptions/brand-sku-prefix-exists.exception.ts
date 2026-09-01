import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

export class BrandSkuPrefixExistsException extends BaseException {
  constructor(details?: { skuPrefix: string }) {
    super(
      'SKU Prefix already exists',
      ErrorCode.BRAND.SKU_PREFIX_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

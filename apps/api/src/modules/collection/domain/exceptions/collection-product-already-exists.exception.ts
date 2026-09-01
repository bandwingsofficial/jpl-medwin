// src/modules/collection/domain/exceptions/collection-product-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CollectionProductAlreadyExistsException extends BaseException {
  constructor(details?: {
    collectionId?: string;

    productId?: string;
  }) {
    super(
      'Product already exists in collection',
      ErrorCode.COLLECTION.PRODUCT_ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}

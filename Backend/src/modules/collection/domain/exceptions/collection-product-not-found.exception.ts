// src/modules/collection/domain/exceptions/collection-product-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CollectionProductNotFoundException extends BaseException {
  constructor(details?: {
    collectionId?: string;

    productId?: string;
  }) {
    super(
      'Collection product not found',
      ErrorCode.COLLECTION.PRODUCT_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
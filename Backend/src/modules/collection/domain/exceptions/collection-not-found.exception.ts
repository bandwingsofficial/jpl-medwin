// src/modules/collection/domain/exceptions/collection-not-found.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CollectionNotFoundException extends BaseException {
  constructor(details?: {
    collectionId?: string;

    slug?: string;
  }) {
    super(
      'Collection not found',
      ErrorCode.COLLECTION.NOT_FOUND,
      HttpStatus.NOT_FOUND,
      details,
    );
  }
}
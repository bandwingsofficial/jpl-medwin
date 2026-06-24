// src/modules/collection/domain/exceptions/collection-already-exists.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CollectionAlreadyExistsException extends BaseException {
  constructor(details?: {
    name?: string;

    slug?: string;
  }) {
    super(
      'Collection already exists',
      ErrorCode.COLLECTION.ALREADY_EXISTS,
      HttpStatus.CONFLICT,
      details,
    );
  }
}
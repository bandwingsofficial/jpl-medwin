// src/modules/collection/domain/exceptions/collection-inactive.exception.ts

import { HttpStatus } from '@nestjs/common';

import { BaseException } from '@/common/exceptions/base.exception';

import { ErrorCode } from '@/common/constants/error-codes';

export class CollectionInactiveException extends BaseException {
  constructor(details?: { collectionId?: string }) {
    super('Collection is inactive', ErrorCode.COLLECTION.INACTIVE, HttpStatus.BAD_REQUEST, details);
  }
}

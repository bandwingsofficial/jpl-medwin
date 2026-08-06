// src/modules/collection/domain/services/collection-product-domain.service.ts

import { Injectable } from '@nestjs/common';

import { CollectionProductAlreadyExistsException } from '../exceptions/collection-product-already-exists.exception';

import { CollectionProductNotFoundException } from '../exceptions/collection-product-not-found.exception';

@Injectable()
export class CollectionProductDomainService {
  // =======================
  // ➕ NOT EXISTS
  // =======================

  ensureCanAdd(params: {
    exists: boolean;

    collectionId: string;

    productId: string;
  }): void {
    if (params.exists) {
      throw new CollectionProductAlreadyExistsException({
        collectionId: params.collectionId,

        productId: params.productId,
      });
    }
  }

  // =======================
  // ➖ EXISTS
  // =======================

  ensureCanRemove(params: {
    exists: boolean;

    collectionId: string;

    productId: string;
  }): void {
    if (!params.exists) {
      throw new CollectionProductNotFoundException({
        collectionId: params.collectionId,

        productId: params.productId,
      });
    }
  }

  // =======================
  // 🧠 VALIDATE
  // =======================

  ensureExists(params: {
    exists: boolean;

    collectionId: string;

    productId: string;
  }): void {
    if (!params.exists) {
      throw new CollectionProductNotFoundException({
        collectionId: params.collectionId,

        productId: params.productId,
      });
    }
  }
}

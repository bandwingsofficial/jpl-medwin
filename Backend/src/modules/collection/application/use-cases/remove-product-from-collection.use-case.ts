// src/modules/collection/application/use-cases/remove-product-from-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionProductRepository } from '../../domain/repositories/collection-product.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

import { CollectionProductDomainService } from '../../domain/services/collection-product-domain.service';

@Injectable()
export class RemoveProductFromCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    @Inject(TOKENS.COLLECTION_PRODUCT_REPO)
    private readonly collectionProductRepo: CollectionProductRepository,

    private readonly collectionDomainService: CollectionDomainService,

    private readonly collectionProductDomainService: CollectionProductDomainService,
  ) {}

  async execute(input: {
    collectionId: string;

    productId: string;
  }): Promise<void> {
    // =======================
    // 🔍 COLLECTION
    // =======================

    this.collectionDomainService.ensureExists({
      collection:
        await this.collectionRepo.findById(
          input.collectionId,
        ),

      collectionId:
        input.collectionId,
    });

    // =======================
    // 🔍 EXISTS
    // =======================

    const exists =
      await this.collectionProductRepo.exists({
        collectionId:
          input.collectionId,

        productId:
          input.productId,
      });

    this.collectionProductDomainService.ensureCanRemove({
      exists,

      collectionId:
        input.collectionId,

      productId:
        input.productId,
    });

    // =======================
    // ❌ REMOVE
    // =======================

    await this.collectionProductRepo.deleteByCollectionAndProduct({
      collectionId:
        input.collectionId,

      productId:
        input.productId,
    });
  }
}
// src/modules/collection/application/use-cases/add-product-to-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionProductRepository } from '../../domain/repositories/collection-product.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

import { CollectionProductDomainService } from '../../domain/services/collection-product-domain.service';

import { CollectionProduct } from '../../domain/entities/collection-product.entity';

import { CollectionProductNotFoundException } from '../../domain/exceptions/collection-product-not-found.exception';

@Injectable()
export class AddProductToCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    @Inject(TOKENS.COLLECTION_PRODUCT_REPO)
    private readonly collectionProductRepo: CollectionProductRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    private readonly collectionDomainService: CollectionDomainService,

    private readonly collectionProductDomainService: CollectionProductDomainService,
  ) {}

  async execute(input: {
    collectionId: string;

    productId: string;
  }) {
    // =======================
    // 🔍 COLLECTION
    // =======================

    const collection =
      this.collectionDomainService.ensureExists({
        collection:
          await this.collectionRepo.findById(
            input.collectionId,
          ),

        collectionId:
          input.collectionId,
      });

    // =======================
    // 📦 PRODUCT
    // =======================

    const product =
      await this.productRepo.findById(
        input.productId,
      );

    if (!product) {
      throw new CollectionProductNotFoundException({
        productId: input.productId,
      });
    }

    // =======================
    // 🧠 EXISTS
    // =======================

    const exists =
      await this.collectionProductRepo.exists({
        collectionId:
          input.collectionId,

        productId:
          input.productId,
      });

    this.collectionProductDomainService.ensureCanAdd({
      exists,

      collectionId:
        input.collectionId,

      productId:
        input.productId,
    });

    // =======================
    // ➕ CREATE
    // =======================

    const item =
      new CollectionProduct(
        crypto.randomUUID(),

        input.collectionId,

        input.productId,
      );

    const created =
      await this.collectionProductRepo.create(
        item,
      );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: created.id,

      collectionId:
        created.collectionId,

      productId:
        created.productId,

      createdAt:
        created.createdAt,
    };
  }
}
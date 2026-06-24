// src/modules/collection/application/use-cases/get-collections.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionStatus } from '../../domain/enums/collection-status.enum';

import { CollectionProductRepository } from '../../domain/repositories/collection-product.repository';

@Injectable()
export class GetCollectionsUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    @Inject(TOKENS.COLLECTION_PRODUCT_REPO)
    private readonly collectionProductRepo: CollectionProductRepository,
  ) {}

  async execute(input: {
    status?: CollectionStatus;

    page?: number;

    limit?: number;
  } = {}) {
    // =======================
    // 📄 PAGINATION
    // =======================

    const page =
      Number(input.page) || 1;

    const limit = Math.min(
      Number(input.limit) || 20,
      100,
    );

    // =======================
    // 📦 COLLECTIONS
    // =======================

    const collections =
      input.status
        ? await this.collectionRepo.findByStatus(
            input.status,
          )
        : await this.collectionRepo.findAll();

    const total =
      collections.length;

    const start =
      (page - 1) * limit;

    const paginated =
      collections.slice(
        start,
        start + limit,
      );

    // =======================
    // 🚀 ITEMS
    // =======================

    const data =
      await Promise.all(
        paginated.map(
          async (collection) => {
            const products =
              await this.collectionProductRepo.findByCollectionId(
                collection.id,
              );

            return {
              id: collection.id,

              name: collection.name,

              slug: collection.slug,

              imageUrl:
                collection.imageUrl ??
                null,

              description:
                collection.description ??
                null,

              metaDescription:
                collection.metaDescription ??
                null,

              status:
                collection.status,

              productCount:
                products.length,

              createdAt:
                collection.createdAt,

              updatedAt:
                collection.updatedAt,
            };
          },
        ),
      );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      data,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }
}
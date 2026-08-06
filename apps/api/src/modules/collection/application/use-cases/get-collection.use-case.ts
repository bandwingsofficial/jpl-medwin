// src/modules/collection/application/use-cases/get-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '@/modules/product/domain/repositories/product.repository';

import { ProductResponseMapper } from '@/modules/product/infrastructure/persistence/prisma/mappers/product-response.mapper';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionProductRepository } from '../../domain/repositories/collection-product.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

@Injectable()
export class GetCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    @Inject(TOKENS.COLLECTION_PRODUCT_REPO)
    private readonly collectionProductRepo: CollectionProductRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    private readonly domainService: CollectionDomainService,
  ) {}

  async execute(input: {
    collectionId: string;

    page?: number;

    limit?: number;
  }) {
    // =======================
    // 📄 PAGINATION
    // =======================

    const page = Number(input.page) || 1;

    const limit = Math.min(Number(input.limit) || 20, 100);

    // =======================
    // 🔍 COLLECTION
    // =======================

    const collection = this.domainService.ensureExists({
      collection: await this.collectionRepo.findById(input.collectionId),

      collectionId: input.collectionId,
    });

    // =======================
    // 📦 COLLECTION PRODUCTS
    // =======================

    const collectionProducts = await this.collectionProductRepo.findByCollectionId(collection.id);

    const total = collectionProducts.length;

    const start = (page - 1) * limit;

    const paginated = collectionProducts.slice(start, start + limit);

    // =======================
    // 📦 PRODUCTS
    // =======================

    const products = await Promise.all(
      paginated.map(async (item) => {
        const product = await this.productRepo.findFullById(item.productId);

        if (!product) {
          return null;
        }

        return {
          ...ProductResponseMapper.map(product),

          collectionProduct: {
            id: item.id,

            collectionId: item.collectionId,

            addedAt: item.createdAt,
          },
        };
      }),
    );

    // =======================
    // 🚀 RESPONSE
    // =======================

    const validProducts = products.filter(Boolean);

    return {
      collection: {
        id: collection.id,

        name: collection.name,

        slug: collection.slug,

        imageUrl: collection.imageUrl ?? null,

        description: collection.description ?? null,

        metaDescription: collection.metaDescription ?? null,

        status: collection.status,

        createdAt: collection.createdAt,

        updatedAt: collection.updatedAt,
      },

      products: validProducts,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

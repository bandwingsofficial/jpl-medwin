// src/modules/collection/application/use-cases/get-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';
import { ProductS3ImageResolverService } from '@/modules/product/application/services/product-s3-image-resolver.service';
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

private readonly productS3ImageResolver: ProductS3ImageResolverService,

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

    const mapped = ProductResponseMapper.map(product);

    const s3Images =
      await this.productS3ImageResolver.resolveProductImages(
        product.name,
      );

    mapped.images.main = s3Images.mainImage;
    mapped.images.gallery = s3Images.galleryImages;

    mapped.variants?.forEach((variant: any) => {
      delete variant.createdAt;
      delete variant.updatedAt;
      delete variant.deletedAt;
      delete variant.pricing.purchasePrice;
    });

    delete mapped.createdAt;
    delete mapped.updatedAt;
    delete mapped.deletedAt;

    return {
      ...mapped,

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

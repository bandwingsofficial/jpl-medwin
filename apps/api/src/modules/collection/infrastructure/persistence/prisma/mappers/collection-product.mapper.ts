// src/modules/collection/infrastructure/persistence/prisma/mappers/collection-product.mapper.ts

import { CollectionProduct as PrismaCollectionProduct } from '@prisma/client';

import { CollectionProduct } from '../../../../domain/entities/collection-product.entity';

export class CollectionProductMapper {
  static toDomain(p: PrismaCollectionProduct): CollectionProduct {
    return new CollectionProduct(
      p.id,

      p.collectionId,

      p.productId,

      p.sortOrder,

      p.createdAt,
    );
  }

  static toPersistence(e: CollectionProduct) {
    return {
      id: e.id,

      collectionId: e.collectionId,

      productId: e.productId,

      sortOrder: e.sortOrder,

      createdAt: e.createdAt,
    };
  }
}

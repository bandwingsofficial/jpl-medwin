// src/modules/collection/domain/repositories/collection-product.repository.ts

import { CollectionProduct } from '../entities/collection-product.entity';

export interface CollectionProductRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<CollectionProduct | null>;

  findByCollectionId(collectionId: string): Promise<CollectionProduct[]>;

  findByProductId(productId: string): Promise<CollectionProduct[]>;

  findByCollectionAndProduct(params: {
    collectionId: string;

    productId: string;
  }): Promise<CollectionProduct | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  exists(params: {
    collectionId: string;

    productId: string;
  }): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(item: CollectionProduct): Promise<CollectionProduct>;

  createMany(items: CollectionProduct[]): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  delete(id: string): Promise<void>;

  deleteByCollectionAndProduct(params: {
    collectionId: string;

    productId: string;
  }): Promise<void>;

  deleteByCollectionId(collectionId: string): Promise<void>;

  deleteByProductId(productId: string): Promise<void>;
}

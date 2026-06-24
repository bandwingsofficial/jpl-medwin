// src/modules/collection/domain/repositories/collection.repository.ts

import { Collection } from '../entities/collection.entity';

import { CollectionStatus } from '../enums/collection-status.enum';

export interface CollectionRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
  ): Promise<Collection | null>;

  findBySlug(
    slug: string,
  ): Promise<Collection | null>;

  findAll(): Promise<Collection[]>;

  findByStatus(
    status: CollectionStatus,
  ): Promise<Collection[]>;

  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  findByNameIncludingDeleted(
    name: string,
  ): Promise<Collection | null>;

  findBySlugIncludingDeleted(
    slug: string,
  ): Promise<Collection | null>;

  findByIdIncludingDeleted(
  id: string,
): Promise<Collection | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsByName(
    name: string,
  ): Promise<boolean>;

  existsBySlug(
    slug: string,
  ): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(
    collection: Collection,
  ): Promise<Collection>;

  update(
    collection: Collection,
  ): Promise<Collection>;

  // =======================
  // 🔄 STATUS
  // =======================

  activate(
    collectionId: string,
  ): Promise<void>;

  deactivate(
    collectionId: string,
  ): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(
    collectionId: string,
  ): Promise<void>;

  restore(
    collectionId: string,
  ): Promise<void>;
}
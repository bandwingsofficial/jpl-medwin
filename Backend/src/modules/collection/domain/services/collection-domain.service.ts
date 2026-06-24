// src/modules/collection/domain/services/collection-domain.service.ts

import { Injectable } from '@nestjs/common';

import { Collection } from '../entities/collection.entity';

import { CollectionStatus } from '../enums/collection-status.enum';

import { CollectionNotFoundException } from '../exceptions/collection-not-found.exception';

import { CollectionInactiveException } from '../exceptions/collection-inactive.exception';
import { CollectionAlreadyExistsException } from '../exceptions/collection-already-exists.exception';

@Injectable()
export class CollectionDomainService {
  // =======================
  // 🔍 EXISTS
  // =======================

  ensureExists(params: {
  collection: Collection | null;

  collectionId?: string;

  slug?: string;
}): Collection {
  if (!params.collection) {
    throw new CollectionNotFoundException({
      collectionId: params.collectionId,
      slug: params.slug,
    });
  }

  return params.collection;
}

generateSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

  // =======================
  // 🟢 ACTIVE
  // =======================

  ensureActive(
    collection: Collection,
  ): void {
    if (
      collection.status ===
      CollectionStatus.INACTIVE
    ) {
      throw new CollectionInactiveException({
        collectionId: collection.id,
      });
    }
  }

  // =======================
  // 🔴 INACTIVE
  // =======================

  ensureInactive(
    collection: Collection,
  ): void {
    if (
      collection.status ===
      CollectionStatus.ACTIVE
    ) {
      throw new Error(
        'Collection is already active',
      );
    }
  }

  // =======================
  // ♻️ DELETED
  // =======================

  ensureNotDeleted(
    collection: Collection,
  ): void {
    if (collection.isDeleted()) {
      throw new CollectionNotFoundException({
        collectionId: collection.id,
      });
    }
  }

  // =======================
  // 📦 USABLE
  // =======================

  ensureUsable(
    collection: Collection,
  ): void {
    this.ensureNotDeleted(collection);

    this.ensureActive(collection);
  }

  // =======================
// 🔍 UNIQUE
// =======================

ensureUnique(params: {
  nameExists: boolean;

  slugExists: boolean;

  name: string;

  slug: string;
}): void {
  if (params.nameExists) {
    throw new CollectionAlreadyExistsException({
      name: params.name,
    });
  }

  if (params.slugExists) {
    throw new CollectionAlreadyExistsException({
      slug: params.slug,
    });
  }
}
}
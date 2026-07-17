// src/modules/collection/infrastructure/persistence/prisma/mappers/collection.mapper.ts

import {
  Collection as PrismaCollection,
  CollectionStatus as PrismaCollectionStatus,
} from '@prisma/client';

import { Collection } from '../../../../domain/entities/collection.entity';

import { CollectionStatus } from '../../../../domain/enums/collection-status.enum';

import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CollectionMapper {
  // =======================
  // 🔄 ENUM
  // =======================

  private static toDomainStatus(status: PrismaCollectionStatus): CollectionStatus {
    switch (status) {
      case PrismaCollectionStatus.ACTIVE:
        return CollectionStatus.ACTIVE;

      case PrismaCollectionStatus.INACTIVE:
        return CollectionStatus.INACTIVE;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown PrismaCollectionStatus',

          value: status,

          direction: 'prisma_to_domain',
        });
    }
  }

  private static toPrismaStatus(status: CollectionStatus): PrismaCollectionStatus {
    switch (status) {
      case CollectionStatus.ACTIVE:
        return PrismaCollectionStatus.ACTIVE;

      case CollectionStatus.INACTIVE:
        return PrismaCollectionStatus.INACTIVE;

      default:
        throw new InvalidEnumMappingException({
          enumName: 'Unknown CollectionStatus',

          value: status,

          direction: 'domain_to_prisma',
        });
    }
  }

  // =======================
  // 📦 COLLECTION
  // =======================

  static toDomain(p: PrismaCollection): Collection {
    return new Collection(
      p.id,

      // =======================
      // BASIC
      // =======================

      p.name,

      p.slug,

      p.imageUrl ?? undefined,

      p.description ?? undefined,

      p.metaDescription ?? undefined,

      // =======================
      // STATUS
      // =======================

      this.toDomainStatus(p.status),

      // =======================
      // TIMESTAMPS
      // =======================

      p.createdAt,

      p.updatedAt,

      // =======================
      // DELETE
      // =======================

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: Collection) {
    return {
      id: e.id,

      // =======================
      // BASIC
      // =======================

      name: e.name,

      slug: e.slug,

      imageUrl: e.imageUrl ?? null,

      description: e.description ?? null,

      metaDescription: e.metaDescription ?? null,

      // =======================
      // STATUS
      // =======================

      status: this.toPrismaStatus(e.status),

      // =======================
      // TIMESTAMPS
      // =======================

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      // =======================
      // DELETE
      // =======================

      deletedAt: e.deletedAt ?? null,
    };
  }
}

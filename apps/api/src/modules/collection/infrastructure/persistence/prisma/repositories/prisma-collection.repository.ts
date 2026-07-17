// src/modules/collection/infrastructure/persistence/prisma/repositories/prisma-collection.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CollectionRepository } from '../../../../domain/repositories/collection.repository';

import { Collection } from '../../../../domain/entities/collection.entity';

import { CollectionStatus } from '../../../../domain/enums/collection-status.enum';

import { CollectionMapper } from '../mappers/collection.mapper';

@Injectable()
export class PrismaCollectionRepository implements CollectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Collection | null> {
    const data = await this.prisma.collection.findFirst({
      where: {
        id,

        deletedAt: null,
      },
    });

    return data ? CollectionMapper.toDomain(data) : null;
  }

  async findBySlug(slug: string): Promise<Collection | null> {
    const data = await this.prisma.collection.findFirst({
      where: {
        slug,

        deletedAt: null,
      },
    });

    return data ? CollectionMapper.toDomain(data) : null;
  }

  async findAll(): Promise<Collection[]> {
    const data = await this.prisma.collection.findMany({
      where: {
        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => CollectionMapper.toDomain(item));
  }

  async findByStatus(status: CollectionStatus): Promise<Collection[]> {
    const data = await this.prisma.collection.findMany({
      where: {
        status,

        deletedAt: null,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return data.map((item) => CollectionMapper.toDomain(item));
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsByName(name: string): Promise<boolean> {
    const count = await this.prisma.collection.count({
      where: {
        name,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.collection.count({
      where: {
        slug,

        deletedAt: null,
      },
    });

    return count > 0;
  }

  // =======================
  // ♻️ FIND INCLUDING DELETED
  // =======================

  async findByNameIncludingDeleted(name: string): Promise<Collection | null> {
    const data = await this.prisma.collection.findFirst({
      where: {
        name,
      },
    });

    return data ? CollectionMapper.toDomain(data) : null;
  }

  async findBySlugIncludingDeleted(slug: string): Promise<Collection | null> {
    const data = await this.prisma.collection.findFirst({
      where: {
        slug,
      },
    });

    return data ? CollectionMapper.toDomain(data) : null;
  }
  async findByIdIncludingDeleted(id: string): Promise<Collection | null> {
    const data = await this.prisma.collection.findUnique({
      where: {
        id,
      },
    });

    return data ? CollectionMapper.toDomain(data) : null;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(collection: Collection): Promise<Collection> {
    const data = await this.prisma.collection.create({
      data: CollectionMapper.toPersistence(collection),
    });

    return CollectionMapper.toDomain(data);
  }

  async update(collection: Collection): Promise<Collection> {
    const data = await this.prisma.collection.update({
      where: {
        id: collection.id,
      },

      data: CollectionMapper.toPersistence(collection),
    });

    return CollectionMapper.toDomain(data);
  }

  // =======================
  // 🔄 STATUS
  // =======================

  async activate(collectionId: string): Promise<void> {
    await this.prisma.collection.update({
      where: {
        id: collectionId,
      },

      data: {
        status: CollectionStatus.ACTIVE,
      },
    });
  }

  async deactivate(collectionId: string): Promise<void> {
    await this.prisma.collection.update({
      where: {
        id: collectionId,
      },

      data: {
        status: CollectionStatus.INACTIVE,
      },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(collectionId: string): Promise<void> {
    await this.prisma.collection.update({
      where: {
        id: collectionId,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async restore(collectionId: string): Promise<void> {
    await this.prisma.collection.update({
      where: {
        id: collectionId,
      },

      data: {
        deletedAt: null,
      },
    });
  }
}

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

      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return data.map((item) => CollectionMapper.toDomain(item));
  }

  async findByStatus(status: CollectionStatus): Promise<Collection[]> {
    const data = await this.prisma.collection.findMany({
      where: {
        status,

        deletedAt: null,
      },

      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    return data.map((item) => CollectionMapper.toDomain(item));
  }

  // =======================
  // 🧠 CHECKS & COUNTS
  // =======================

  async countActive(): Promise<number> {
    return this.prisma.collection.count({
      where: {
        deletedAt: null,
      },
    });
  }

  async getNextOrder(): Promise<number> {
    const count = await this.countActive();
    return count + 1;
  }

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
  // ✍️ WRITE WITH ORDER
  // =======================

  async create(collection: Collection): Promise<Collection> {
    return this.createWithOrder(collection, collection.order);
  }

  async createWithOrder(collection: Collection, requestedOrder?: number): Promise<Collection> {
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch all active collections ordered by order ASC, createdAt ASC
      const activeCollections = await tx.collection.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      });

      const total = activeCollections.length;

      // 2. Normalize requested order
      let targetOrder: number;
      if (requestedOrder === undefined || requestedOrder === null || isNaN(requestedOrder)) {
        targetOrder = total + 1;
      } else if (requestedOrder > total + 1) {
        targetOrder = total + 1;
      } else if (requestedOrder < 1) {
        targetOrder = 1;
      } else {
        targetOrder = Math.floor(requestedOrder);
      }

      // 3. Shift affected collections downward
      // Active collections before insertion point (index 0 to targetOrder - 2) keep order = index + 1
      // Active collections at and after insertion point (index targetOrder - 1 to total - 1) shift to order = index + 2
      for (let i = 0; i < activeCollections.length; i++) {
        const item = activeCollections[i];
        const newOrderForExisting = i < targetOrder - 1 ? i + 1 : i + 2;

        if (item.order !== newOrderForExisting) {
          await tx.collection.update({
            where: { id: item.id },
            data: { order: newOrderForExisting },
          });
        }
      }

      // 4. Create the new collection with targetOrder
      collection.order = targetOrder;
      const persistenceData = CollectionMapper.toPersistence(collection);

      const created = await tx.collection.create({
        data: {
          ...persistenceData,
          order: targetOrder,
        },
      });

      return CollectionMapper.toDomain(created);
    });
  }

  async update(collection: Collection): Promise<Collection> {
    return this.updateWithOrder(collection, collection.order);
  }

  async updateWithOrder(collection: Collection, newOrder?: number): Promise<Collection> {
    return this.prisma.$transaction(async (tx) => {
      const activeCollections = await tx.collection.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      });

      const existingIndex = activeCollections.findIndex((c) => c.id === collection.id);

      if (existingIndex === -1) {
        // Not active or not found in active list - standard update
        const updated = await tx.collection.update({
          where: { id: collection.id },
          data: CollectionMapper.toPersistence(collection),
        });
        return CollectionMapper.toDomain(updated);
      }

      const currentOrder = activeCollections[existingIndex].order;
      const total = activeCollections.length;

      // Determine target order
      let targetOrder = currentOrder;
      if (newOrder !== undefined && newOrder !== null && !isNaN(newOrder)) {
        if (newOrder > total) {
          targetOrder = total;
        } else if (newOrder < 1) {
          targetOrder = 1;
        } else {
          targetOrder = Math.floor(newOrder);
        }
      }

      // Re-sequence in memory array
      const reorderedList = [...activeCollections];
      const [removed] = reorderedList.splice(existingIndex, 1);
      reorderedList.splice(targetOrder - 1, 0, removed);

      // Apply updates
      for (let i = 0; i < reorderedList.length; i++) {
        const item = reorderedList[i];
        const correctOrder = i + 1;

        if (item.id === collection.id) {
          collection.order = correctOrder;
          await tx.collection.update({
            where: { id: collection.id },
            data: {
              ...CollectionMapper.toPersistence(collection),
              order: correctOrder,
            },
          });
        } else if (item.order !== correctOrder) {
          await tx.collection.update({
            where: { id: item.id },
            data: { order: correctOrder },
          });
        }
      }

      const refreshed = await tx.collection.findUnique({
        where: { id: collection.id },
      });

      return refreshed ? CollectionMapper.toDomain(refreshed) : collection;
    });
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
  // ❌ DELETE & RESTORE WITH REORDER
  // =======================

  async softDelete(collectionId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          deletedAt: new Date(),
        },
      });

      // Fetch remaining active collections and re-sequence 1...N
      const remainingActive = await tx.collection.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      });

      for (let i = 0; i < remainingActive.length; i++) {
        const expectedOrder = i + 1;
        if (remainingActive[i].order !== expectedOrder) {
          await tx.collection.update({
            where: { id: remainingActive[i].id },
            data: { order: expectedOrder },
          });
        }
      }
    });
  }

  async restore(collectionId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // 1. Un-delete
      await tx.collection.update({
        where: {
          id: collectionId,
        },
        data: {
          deletedAt: null,
        },
      });

      // 2. Fetch all active and re-sequence 1...N
      const allActive = await tx.collection.findMany({
        where: { deletedAt: null },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      });

      for (let i = 0; i < allActive.length; i++) {
        const expectedOrder = i + 1;
        if (allActive[i].order !== expectedOrder) {
          await tx.collection.update({
            where: { id: allActive[i].id },
            data: { order: expectedOrder },
          });
        }
      }
    });
  }
}


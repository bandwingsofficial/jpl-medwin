// src/modules/collection/infrastructure/persistence/prisma/repositories/prisma-collection-product.repository.ts

import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CollectionProductRepository } from '../../../../domain/repositories/collection-product.repository';

import { CollectionProduct } from '../../../../domain/entities/collection-product.entity';

import { CollectionProductMapper } from '../mappers/collection-product.mapper';

@Injectable()
export class PrismaCollectionProductRepository
  implements CollectionProductRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(
    id: string,
  ): Promise<CollectionProduct | null> {
    const data =
      await this.prisma.collectionProduct.findUnique({
        where: {
          id,
        },
      });

    return data
      ? CollectionProductMapper.toDomain(data)
      : null;
  }

  async findByCollectionId(
    collectionId: string,
  ): Promise<CollectionProduct[]> {
    const data =
      await this.prisma.collectionProduct.findMany({
        where: {
          collectionId,
        },

        orderBy: {
          sortOrder: 'asc',
        },
      });

    return data.map((item) =>
      CollectionProductMapper.toDomain(item),
    );
  }

  async findByProductId(
    productId: string,
  ): Promise<CollectionProduct[]> {
    const data =
      await this.prisma.collectionProduct.findMany({
        where: {
          productId,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return data.map((item) =>
      CollectionProductMapper.toDomain(item),
    );
  }

  async findByCollectionAndProduct(params: {
    collectionId: string;

    productId: string;
  }): Promise<CollectionProduct | null> {
    const data =
      await this.prisma.collectionProduct.findFirst({
        where: {
          collectionId:
            params.collectionId,

          productId:
            params.productId,
        },
      });

    return data
      ? CollectionProductMapper.toDomain(data)
      : null;
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async exists(params: {
    collectionId: string;

    productId: string;
  }): Promise<boolean> {
    const count =
      await this.prisma.collectionProduct.count({
        where: {
          collectionId:
            params.collectionId,

          productId:
            params.productId,
        },
      });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(
    item: CollectionProduct,
  ): Promise<CollectionProduct> {
    const data =
      await this.prisma.collectionProduct.create({
        data:
          CollectionProductMapper.toPersistence(
            item,
          ),
      });

    return CollectionProductMapper.toDomain(
      data,
    );
  }

  async createMany(
    items: CollectionProduct[],
  ): Promise<void> {
    await this.prisma.collectionProduct.createMany({
      data: items.map((item) =>
        CollectionProductMapper.toPersistence(
          item,
        ),
      ),
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async delete(
    id: string,
  ): Promise<void> {
    await this.prisma.collectionProduct.delete({
      where: {
        id,
      },
    });
  }

  async deleteByCollectionAndProduct(params: {
    collectionId: string;

    productId: string;
  }): Promise<void> {
    await this.prisma.collectionProduct.deleteMany({
      where: {
        collectionId:
          params.collectionId,

        productId:
          params.productId,
      },
    });
  }

  async deleteByCollectionId(
    collectionId: string,
  ): Promise<void> {
    await this.prisma.collectionProduct.deleteMany({
      where: {
        collectionId,
      },
    });
  }

  async deleteByProductId(
    productId: string,
  ): Promise<void> {
    await this.prisma.collectionProduct.deleteMany({
      where: {
        productId,
      },
    });
  }
}
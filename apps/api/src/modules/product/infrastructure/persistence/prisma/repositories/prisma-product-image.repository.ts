import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';

import {
  ProductImageRepository,
  FullProductImage,
} from '../../../../domain/repositories/product-image.repository';

import { ProductImage } from '../../../../domain/entities/product-image.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductImageRepository implements ProductImageRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(
    id: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage | null> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return data ? ProductMapper.toDomainImage(data) : null;
  }

  async findByProduct(
    productId: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage[]> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.findMany({
      where: {
        productId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      orderBy: { sortOrder: 'asc' },
    });

    return data.map((img) => ProductMapper.toDomainImage(img));
  }

  async findByVariant(
    variantId: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage[]> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.findMany({
      where: {
        variantId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      orderBy: { sortOrder: 'asc' },
    });

    return data.map((img) => ProductMapper.toDomainImage(img));
  }

  async findMany(params?: {
    where?: Prisma.ProductImageWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductImageOrderByWithRelationInput;
  }): Promise<FullProductImage[]> {
    const data = await this.prisma.productImage.findMany({
      ...params,
      where: {
        ...params?.where,
        deletedAt: null,
      },
    });

    return data;
  }

  async count(where?: Prisma.ProductImageWhereInput): Promise<number> {
    return this.prisma.productImage.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async findMainByProduct(
    productId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage | null> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.findFirst({
      where: {
        productId,
        type: 'MAIN',
        deletedAt: null,
      },
    });

    return data ? ProductMapper.toDomainImage(data) : null;
  }

  async findMainByVariant(
    variantId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage | null> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.findFirst({
      where: {
        variantId,
        type: 'MAIN',
        deletedAt: null,
      },
    });

    return data ? ProductMapper.toDomainImage(data) : null;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(image: ProductImage, tx?: Prisma.TransactionClient): Promise<ProductImage> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.create({
      data: ProductMapper.toCreatePersistenceImage(image),
    });

    return ProductMapper.toDomainImage(data);
  }

  async update(image: ProductImage, tx?: Prisma.TransactionClient): Promise<ProductImage> {
    const client = tx ?? this.prisma;

    const data = await client.productImage.update({
      where: { id: image.id },
      data: ProductMapper.toUpdatePersistenceImage(image), // ⚠️ must exist
    });

    return ProductMapper.toDomainImage(data);
  }

  // =======================
  // ⚡ MAIN IMAGE CONTROL
  // =======================

  async setMainImageForProduct(
    productId: string,
    imageId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.productImage.updateMany({
      where: {
        productId,
        type: 'MAIN',
        deletedAt: null,
      },
      data: { type: 'GALLERY' },
    });

    await client.productImage.update({
      where: { id: imageId },
      data: { type: 'MAIN' },
    });
  }

  async setMainImageForVariant(
    variantId: string,
    imageId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.productImage.updateMany({
      where: {
        variantId,
        type: 'MAIN',
        deletedAt: null,
      },
      data: { type: 'GALLERY' },
    });

    await client.productImage.update({
      where: { id: imageId },
      data: { type: 'MAIN' },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.productImage.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
  async softDeleteByVariantProduct(
    productId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const prisma = tx ?? this.prisma;

    await prisma.productImage.updateMany({
      where: {
        variant: {
          productId,
        },

        deletedAt: null,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async softDeleteByProduct(productId: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.productImage.updateMany({
      where: {
        productId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  async softDeleteByVariant(variantId: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.productImage.updateMany({
      where: {
        variantId,
        deletedAt: null,
      },
      data: { deletedAt: new Date() },
    });
  }

  // =======================
  // 🔄 RESTORE
  // =======================

  async restore(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.productImage.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
  async findByVariantIds(variantIds: string[], includeDeleted = false): Promise<ProductImage[]> {
    if (!variantIds.length) {
      return [];
    }

    const images = await this.prisma.productImage.findMany({
      where: {
        variantId: {
          in: variantIds,
        },

        ...(includeDeleted
          ? {}
          : {
              deletedAt: null,
            }),
      },

      orderBy: {
        sortOrder: 'asc',
      },
    });

    return images.map((img) => ProductMapper.toDomainImage(img));
  }
}

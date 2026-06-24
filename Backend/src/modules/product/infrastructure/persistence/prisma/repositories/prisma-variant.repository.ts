import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';
import { Prisma, ProductStatus as PrismaProductStatus } from '@prisma/client';

import { VariantRepository, FullVariant } from '../../../../domain/repositories/variant.repository';

import { Variant } from '../../../../domain/entities/variant.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaVariantRepository implements VariantRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(
    id: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant | null> {
    const client = tx ?? this.prisma;

    const data = await client.variant.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return data ? ProductMapper.toDomainVariant(data) : null;
  }

  async findBySku(
    sku: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant | null> {
    const client = tx ?? this.prisma;

    const data = await client.variant.findFirst({
      where: {
        sku,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return data ? ProductMapper.toDomainVariant(data) : null;
  }

  async findBySlug(
    slug: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant | null> {
    const client = tx ?? this.prisma;

    const data = await client.variant.findFirst({
      where: {
        slug,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return data ? ProductMapper.toDomainVariant(data) : null;
  }

  async findByProduct(
    productId: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant[]> {
    const client = tx ?? this.prisma;

    const data = await client.variant.findMany({
      where: {
        productId,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
      orderBy: { createdAt: 'asc' }, // 🔥 consistent
    });

    return data.map((v) => ProductMapper.toDomainVariant(v));
  }

  async findMany(params?: {
    where?: Prisma.VariantWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.VariantOrderByWithRelationInput;
  }): Promise<FullVariant[]> {
    const data = await this.prisma.variant.findMany({
      ...params,
      where: {
        ...params?.where,
        deletedAt: null,
      },
      include: {
        images: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    return data;
  }

  async count(where?: Prisma.VariantWhereInput): Promise<number> {
    return this.prisma.variant.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsBySku(
    sku: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const client = tx ?? this.prisma;

    const count = await client.variant.count({
      where: {
        sku,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return count > 0;
  }

  async existsBySlug(
    slug: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const client = tx ?? this.prisma;

    const count = await client.variant.count({
      where: {
        slug,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(variant: Variant, tx?: Prisma.TransactionClient): Promise<Variant> {
    const client = tx ?? this.prisma;

    const data = await client.variant.create({
      data: ProductMapper.toCreatePersistenceVariant(variant),
    });

    return ProductMapper.toDomainVariant(data);
  }

  async update(variant: Variant, tx?: Prisma.TransactionClient): Promise<Variant> {
    const client = tx ?? this.prisma;

    const data = await client.variant.update({
      where: { id: variant.id },
      data: ProductMapper.toUpdatePersistenceVariant(variant),
    });

    return ProductMapper.toDomainVariant(data);
  }

  async updateMany(variants: Variant[], tx?: Prisma.TransactionClient): Promise<void> {
    const prisma = tx ?? this.prisma;

    await Promise.all(
      variants.map((v) =>
        prisma.variant.update({
          where: {
            id: v.id,
          },

          data: {
            status: v.status,
            deletedAt: v.deletedAt,
            updatedAt: v.updatedAt,
          },
        }),
      ),
    );
  }

  // =======================
  // 📦 STOCK
  // =======================

  async updateStock(
    variantId: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.variant.update({
      where: { id: variantId },
      data: { quantity },
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.variant.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: PrismaProductStatus.INACTIVE,
      },
    });
  }

  async softDeleteByProduct(productId: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.variant.updateMany({
      where: {
        productId,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        status: PrismaProductStatus.INACTIVE,
      },
    });
  }

  // =======================
  // 🔄 RESTORE
  // =======================

  async restore(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.variant.update({
      where: { id },
      data: {
        deletedAt: null,
        status: PrismaProductStatus.ACTIVE,
      },
    });
  }
}

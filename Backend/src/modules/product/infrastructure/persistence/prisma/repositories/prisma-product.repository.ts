import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';
import { Prisma, ProductStatus as PrismaProductStatus } from '@prisma/client';

import {
  ProductRepository,
  FullProduct,
  ProductFilters,
} from '../../../../domain/repositories/product.repository';

import { Product } from '../../../../domain/entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(
    id: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<any | null> {
    const client = tx ?? this.prisma;

    const data = await client.product.findUnique({
      where: { id },

      include: {
        category: true,
        subCategory: true,
        miniCategory: true,
      },
    });

    if (!data) return null;

    if (!includeDeleted && data.deletedAt) {
      return null;
    }

    return ProductMapper.toDomainProduct(data);
  }

  async findByIds(ids: string[], tx?: Prisma.TransactionClient): Promise<Product[]> {
    const client = tx ?? this.prisma;

    const data = await client.product.findMany({
      where: {
        id: {
          in: ids,
        },
        deletedAt: null,
      },
    });

    return data.map((item) => ProductMapper.toDomainProduct(item));
  }

  async findFullById(id: string, tx?: Prisma.TransactionClient): Promise<FullProduct | null> {
    const client = tx ?? this.prisma;

    const data = await client.product.findUnique({
      where: { id },

      include: {
        brand: true,

        category: true,

        subCategory: true,

        miniCategory: true,

        images: {
          where: {
            deletedAt: null,
          },

          orderBy: {
            sortOrder: 'asc',
          },
        },

        variants: {
          where: {
            deletedAt: null,
          },

          orderBy: {
            createdAt: 'asc',
          },

          include: {
            images: {
              where: {
                deletedAt: null,
              },

              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });

    if (!data || data.deletedAt) {
      return null;
    }

    return data;
  }

  async findBySlug(
    slug: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<Product | null> {
    const client = tx ?? this.prisma;

    const data = await client.product.findFirst({
      where: {
        slug,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    if (!data) return null;

    return ProductMapper.toDomainProduct(data);
  }

  async findMany(params?: {
    where?: Prisma.ProductWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<FullProduct[]> {
    const data = await this.prisma.product.findMany({
      ...params,
      where: {
        ...params?.where,
        deletedAt: null,
      },
      include: {
        brand: true,
        category: true,
        subCategory: true,
        miniCategory: true,

        images: {
          where: { deletedAt: null },
          orderBy: { sortOrder: 'asc' },
        },

        variants: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
          include: {
            images: {
              where: { deletedAt: null },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    return data;
  }

  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return this.prisma.product.count({
      where: {
        ...where,
        deletedAt: null,
      },
    });
  }

  async filter(filters: ProductFilters): Promise<FullProduct[]> {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,

        ...(filters.categoryId && {
          categoryId: filters.categoryId,
        }),

        ...(filters.subCategoryId && {
          subCategoryId: filters.subCategoryId,
        }),

        ...(filters.miniCategoryId && {
          miniCategoryId: filters.miniCategoryId,
        }),

        ...(filters.brandId && {
          brandId: filters.brandId,
        }),

        ...(filters.type && {
          type: filters.type as any,
        }),

        ...(filters.status && {
          status: filters.status as any,
        }),

        ...(filters.tag && {
          tags: {
            has: filters.tag,
          },
        }),

        ...(filters.search && {
          OR: [
            {
              name: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
            {
              slug: {
                contains: filters.search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },

      skip: filters.skip,

      take: filters.take,

      orderBy: filters.orderBy,

      include: {
        brand: true,

        category: true,

        subCategory: true,

        miniCategory: true,

        images: {
          where: {
            deletedAt: null,
          },

          orderBy: {
            sortOrder: 'asc',
          },
        },

        variants: {
          where: {
            deletedAt: null,
          },

          orderBy: {
            createdAt: 'asc',
          },

          include: {
            images: {
              where: {
                deletedAt: null,
              },

              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsBySlug(
    slug: string,
    includeDeleted = false,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean> {
    const client = tx ?? this.prisma;

    const count = await client.product.count({
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

  async create(product: Product, tx?: Prisma.TransactionClient): Promise<Product> {
    const client = tx ?? this.prisma;

    const data = await client.product.create({
      data: ProductMapper.toCreatePersistenceProduct(product),
    });

    return ProductMapper.toDomainProduct(data);
  }

  async update(product: Product, tx?: Prisma.TransactionClient): Promise<Product> {
    const client = tx ?? this.prisma;

    const data = await client.product.update({
      where: { id: product.id },
      data: ProductMapper.toUpdatePersistenceProduct(product),
    });

    return ProductMapper.toDomainProduct(data);
  }

  // =======================
  // ❌ DELETE
  // =======================

  async softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void> {
    const client = tx ?? this.prisma;

    await client.product.update({
      where: { id },
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

    await client.product.update({
      where: { id },
      data: {
        deletedAt: null,
        status: PrismaProductStatus.ACTIVE,
      },
    });
  }
}

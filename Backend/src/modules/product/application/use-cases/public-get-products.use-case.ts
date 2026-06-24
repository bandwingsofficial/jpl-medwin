import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductStatus } from '../../domain/enums/product-status.enum';

import { ProductResponseMapper } from '../../infrastructure/persistence/prisma/mappers/product-response.mapper';

// =======================
// RESPONSE
// =======================

type PaginatedProducts = {
  data: any[];

  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

// =======================
// INPUT
// =======================

type PublicGetProductsInput = {
  categoryId?: string;

  subCategoryId?: string;

  miniCategoryId?: string;

  brandId?: string;

  type?: string;

  search?: string;

  tag?: string;

  minPrice?: number;

  maxPrice?: number;

  inStock?: boolean;

  includeVariants?: boolean;

  sortBy?:
    | 'newest'
    | 'oldest'
    | 'nameAsc'
    | 'nameDesc'
    | 'priceLowToHigh'
    | 'priceHighToLow';

  page?: number;

  limit?: number;
};

@Injectable()
export class PublicGetProductsUseCase {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(
    input: PublicGetProductsInput = {},
  ): Promise<PaginatedProducts> {
    // =======================
    // PAGINATION
    // =======================

    const page = Number(input.page) || 1;

    const limit = Math.min(
      Number(input.limit) || 20,
      100,
    );

    const skip = (page - 1) * limit;

    // =======================
    // FILTER
    // =======================

    const where: any = {
      deletedAt: null,

      status: ProductStatus.ACTIVE,
    };

    if (input.categoryId) {
      where.categoryId = input.categoryId;
    }

    if (input.subCategoryId) {
      where.subCategoryId = input.subCategoryId;
    }

    if (input.miniCategoryId) {
      where.miniCategoryId = input.miniCategoryId;
    }

    if (input.brandId) {
      where.brandId = input.brandId;
    }

    if (input.type) {
      where.type = input.type;
    }

    if (input.tag) {
      where.tags = {
        has: input.tag,
      };
    }

    if (input.search?.trim()) {
      where.OR = [
        {
          name: {
            contains: input.search,
            mode: 'insensitive',
          },
        },

        {
          slug: {
            contains: input.search,
            mode: 'insensitive',
          },
        },

        {
          shortDescription: {
            contains: input.search,
            mode: 'insensitive',
          },
        },

        {
          longDescription: {
            contains: input.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    // =======================
    // SORT
    // =======================

    let orderBy: any = {
      createdAt: 'desc',
    };

    switch (input.sortBy) {
      case 'oldest':
        orderBy = {
          createdAt: 'asc',
        };
        break;

      case 'nameAsc':
        orderBy = {
          name: 'asc',
        };
        break;

      case 'nameDesc':
        orderBy = {
          name: 'desc',
        };
        break;
    }

    // =======================
    // QUERY
    // =======================

    const [products, total] = await Promise.all([
      this.productRepo.findMany({
        where,

        skip,

        take: limit,

        orderBy,
      }),

      this.productRepo.count(where),
    ]);

    // =======================
    // MAP
    // =======================

    let data = products.map((product) => {
      const mapped = ProductResponseMapper.map(product);

      // remove sensitive/internal fields

      mapped.variants?.forEach((variant: any) => {
        delete variant.createdAt;
        delete variant.updatedAt;
        delete variant.deletedAt;

        delete variant.pricing.purchasePrice;
      });

      delete mapped.createdAt;
      delete mapped.updatedAt;
      delete mapped.deletedAt;

      if (input.includeVariants === false) {
        mapped.variants = [];
      }

      return mapped;
    });

    // =======================
    // PRICE FILTER
    // =======================

    if (
      input.minPrice !== undefined ||
      input.maxPrice !== undefined
    ) {
      data = data.filter((p) => {
        const price = p.price.min ?? 0;

        if (
          input.minPrice !== undefined &&
          price < input.minPrice
        ) {
          return false;
        }

        if (
          input.maxPrice !== undefined &&
          price > input.maxPrice
        ) {
          return false;
        }

        return true;
      });
    }

    // =======================
    // STOCK FILTER
    // =======================

    if (input.inStock === true) {
      data = data.filter(
        (p) => p.stock.inStock,
      );
    }

    return {
      data,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }
}
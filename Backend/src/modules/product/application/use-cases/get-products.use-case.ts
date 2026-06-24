import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductStatus } from '../../domain/enums/product-status.enum';
import { ProductResponseMapper } from '../../infrastructure/persistence/prisma/mappers/product-response.mapper';

// =======================
// 📦 RESPONSE
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
// 📦 INPUT
// =======================

type GetProductsInput = {
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

  status?: ProductStatus;

  onlyActive?: boolean;

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
export class GetProductsUseCase {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async execute(input: GetProductsInput = {}): Promise<PaginatedProducts> {
  // =======================
  // 📄 PAGINATION
  // =======================

  const page = Number(input.page) || 1;

  const limit = Math.min(Number(input.limit) || 20, 100);

  const skip = (page - 1) * limit;
  console.log({
  inputPage: input.page,
  page,
  limit,
  skip,
});

  // =======================
  // 🔥 FILTER
  // =======================

  const where: any = {
    deletedAt: null,
  };

  // =======================
  // STATUS
  // =======================

  if (input.onlyActive !== false) {
    where.status = ProductStatus.ACTIVE;
  }

  if (input.status) {
    where.status = input.status;
  }

  // =======================
  // CATEGORY FILTERS
  // =======================

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

  // =======================
  // TAG FILTER
  // =======================

  if (input.tag) {
    where.tags = {
      has: input.tag,
    };
  }

  // =======================
  // SEARCH
  // =======================

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
        tags: {
          has: input.search,
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
    data = data.filter((p) => p.stock.inStock);
  }

  // =======================
  // PRICE SORT
  // =======================

  if (input.sortBy === 'priceLowToHigh') {
    data.sort(
      (a, b) =>
        (a.price.min ?? 0) - (b.price.min ?? 0),
    );
  }

  if (input.sortBy === 'priceHighToLow') {
    data.sort(
      (a, b) =>
        (b.price.min ?? 0) - (a.price.min ?? 0),
    );
  }

  // =======================
  // RESPONSE
  // =======================

  return {
    data,

    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
}

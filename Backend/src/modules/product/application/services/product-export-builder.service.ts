import { Inject, Injectable } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';

import { TOKENS } from '@/common/constants/tokens';

import {
  FullProduct,
  ProductRepository,
} from '../../domain/repositories/product.repository';

export interface ProductExportFilter {
  fromDate: Date;
  toDate: Date;

  categoryId?: string;
  brandId?: string;
  status?: ProductStatus;
}

@Injectable()
export class ProductExportBuilderService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  // =======================
  // 📦 Export All Products
  // =======================

  async build(): Promise<FullProduct[]> {
    return this.productRepo.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // =======================
  // 📅 Export By Created At
  // =======================

  async buildByCreatedAt(
    filter: ProductExportFilter,
  ): Promise<FullProduct[]> {
    return this.productRepo.findMany({
      where: {
        createdAt: {
          gte: filter.fromDate,
          lte: filter.toDate,
        },

        ...(filter.categoryId && {
          categoryId: filter.categoryId,
        }),

        ...(filter.brandId && {
          brandId: filter.brandId,
        }),

        ...(filter.status && {
          status: filter.status,
        }),
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  // =======================
  // 🔄 Export By Updated At
  // =======================

  async buildByUpdatedAt(
    filter: ProductExportFilter,
  ): Promise<FullProduct[]> {
    return this.productRepo.findMany({
      where: {
        updatedAt: {
          gte: filter.fromDate,
          lte: filter.toDate,
        },

        ...(filter.categoryId && {
          categoryId: filter.categoryId,
        }),

        ...(filter.brandId && {
          brandId: filter.brandId,
        }),

        ...(filter.status && {
          status: filter.status,
        }),
      },

      orderBy: {
        updatedAt: 'asc',
      },
    });
  }
}
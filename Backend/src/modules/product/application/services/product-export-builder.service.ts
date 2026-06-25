// src/modules/product/application/services/product-export-builder.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { FullProduct, ProductRepository } from '../../domain/repositories/product.repository';

@Injectable()
export class ProductExportBuilderService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async build(): Promise<FullProduct[]> {
    return this.productRepo.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}

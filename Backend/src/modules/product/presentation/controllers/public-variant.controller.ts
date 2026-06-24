// src/modules/product/presentation/controllers/public-variant.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';

import { GetVariantsUseCase } from '../../application/use-cases/get-variants.use-case';

@Controller('products')
export class PublicVariantController {
  constructor(private readonly getVariantsUseCase: GetVariantsUseCase) {}

  @Get(':productId/variants')
  async getVariants(
    @Param('productId')
    productId: string,

    @Query('search')
    search?: string,

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.getVariantsUseCase.execute({
      productId,

      search,

      onlyActive: true,

      includeDeleted: false,

      page: page ? Number(page) : 1,

      limit: limit ? Number(limit) : 20,
    });
  }
}

// src/modules/product/presentation/controllers/public-product.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';

import { PublicGetProductsUseCase } from '../../application/use-cases/public-get-products.use-case';

import { GetProductDetailUseCase } from '../../application/use-cases/get-product-detail.use-case';

@Controller('products')
export class PublicProductController {
  constructor(
    private readonly getProducts: PublicGetProductsUseCase,

    private readonly getProductDetail: GetProductDetailUseCase,
  ) {}

  // =======================
  // 📦 GET PRODUCTS
  // =======================

  @Get()
  getAll(
    @Query('categoryId')
    categoryId?: string,

    @Query('subCategoryId')
    subCategoryId?: string,

    @Query('miniCategoryId')
    miniCategoryId?: string,

    @Query('brandId')
    brandId?: string,

    @Query('type')
    type?: string,

    @Query('search')
    search?: string,

    @Query('tag')
    tag?: string,

    @Query('minPrice')
    minPrice?: string,

    @Query('maxPrice')
    maxPrice?: string,

    @Query('inStock')
    inStock?: string,

    @Query('includeVariants')
    includeVariants?: string,

    @Query('sortBy')
    sortBy?: 'newest' | 'oldest' | 'nameAsc' | 'nameDesc' | 'priceLowToHigh' | 'priceHighToLow',

    @Query('page')
    page?: string,

    @Query('limit')
    limit?: string,
  ) {
    return this.getProducts.execute({
      categoryId,

      subCategoryId,

      miniCategoryId,

      brandId,

      type,

      search,

      tag,

      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,

      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,

      inStock: inStock === 'true',

      includeVariants: includeVariants !== 'false',

      sortBy,

      page: page ? Number(page) : 1,

      limit: limit ? Number(limit) : 20,
    });
  }

  // =======================
  // 📦 GET PRODUCT DETAIL
  // =======================

  @Get(':slug')
  getBySlug(
    @Param('slug')
    slug: string,
  ) {
    return this.getProductDetail.executeBySlug(slug, true);
  }
}

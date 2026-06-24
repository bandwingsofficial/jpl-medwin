// src/modules/product/application/services/product-import-resolver.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { SubCategoryRepository } from '@/modules/category/domain/repositories/sub-category.repository';
import { MiniCategoryRepository } from '@/modules/category/domain/repositories/mini-category.repository';
import { BrandRepository } from '@/modules/brand/domain/repositories/brand.repository';

import { ParsedProduct } from '../types/product-import.types';

@Injectable()
export class ProductImportResolverService {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subCategoryRepo: SubCategoryRepository,

    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniCategoryRepo: MiniCategoryRepository,

    @Inject(TOKENS.BRAND_REPO)
    private readonly brandRepo: BrandRepository,
  ) {}

  // =======================
  // 🔥 RESOLVE PRODUCT
  // =======================

  async resolve(product: ParsedProduct) {
    // =======================
    // CATEGORY
    // =======================

    const category = await this.categoryRepo.findByName(
      product.category,
    );

    if (!category) {
      throw new Error(
        `Category '${product.category}' not found`,
      );
    }

    // =======================
    // SUB CATEGORY
    // =======================

    const subCategory =
      await this.subCategoryRepo.findByNameAndCategory(
        product.subCategory,
        category.id,
      );

    if (!subCategory) {
      throw new Error(
        `Sub category '${product.subCategory}' not found under '${category.name}'`,
      );
    }

    // =======================
    // MINI CATEGORY
    // =======================

    const miniCategory =
      await this.miniCategoryRepo.findByNameAndSubCategory(
        product.miniCategory,
        subCategory.id,
      );

    if (!miniCategory) {
      throw new Error(
        `Mini category '${product.miniCategory}' not found under '${subCategory.name}'`,
      );
    }

    // =======================
    // BRAND
    // =======================

    const brand = await this.brandRepo.findByName(
      product.brand,
    );

    if (!brand) {
      throw new Error(
        `Brand '${product.brand}' not found`,
      );
    }

    // =======================
    // DTO FOR CREATE PRODUCT
    // =======================

    return {
      name: product.name,

      type: product.type,

      categoryId: category.id,

      subCategoryId: subCategory.id,

      miniCategoryId: miniCategory.id,

      brandId: brand.id,

      shortDescription: product.shortDescription,

      longDescription: product.longDescription,

      features: product.features,

      tags: product.tags,

      displayNotes: product.displayNotes,

      specifications: product.specifications,

      packing: product.packing,

      directionOfUse: product.directionOfUse,

      additionalInfo: product.additionalInfo,

      faq: product.faq,

      mainImage: product.images.main,

      images: product.images.gallery.map(
        (url, index) => ({
          url,
          sortOrder: index,
        }),
      ),

      variants: product.variants.map((variant) => ({
        sku: variant.sku,

        name: variant.name,

        purchasePrice: variant.purchasePrice,

        sellingPrice: variant.sellingPrice,

        mrp: variant.mrp,

        quantity: variant.quantity,

        attributes: variant.attributes,

        averageRating: variant.averageRating,

        reviewCount: variant.reviewCount,

        isWeighted: variant.isWeighted,

        warrantyMonths: variant.warrantyMonths,

        mainImage: variant.images.main,

        images: variant.images.gallery.map(
          (url, index) => ({
            url,
            sortOrder: index,
          }),
        ),
      })),
    };
  }
}
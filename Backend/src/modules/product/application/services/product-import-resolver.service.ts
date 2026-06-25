// src/modules/product/application/services/product-import-resolver.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { SubCategoryRepository } from '@/modules/category/domain/repositories/sub-category.repository';
import { MiniCategoryRepository } from '@/modules/category/domain/repositories/mini-category.repository';
import { BrandRepository } from '@/modules/brand/domain/repositories/brand.repository';

import { ParsedProduct } from '../types/product-import.types';

import {
  isPlaceholderImageUrl,
  mergeProductImageBundle,
  mergeVariantImageBundle,
} from '../utils/product-import-image.helper';

import { ProductS3ImageResolverService } from './product-s3-image-resolver.service';

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

    private readonly productS3ImageResolverService: ProductS3ImageResolverService,
  ) {}

  // =======================
  // 🔥 RESOLVE PRODUCT
  // =======================

  async resolve(product: ParsedProduct) {
    const category = await this.categoryRepo.findByName(product.category);

    if (!category) {
      throw new Error(`Category '${product.category}' not found`);
    }

    const subCategory = await this.subCategoryRepo.findByNameAndCategory(
      product.subCategory,
      category.id,
    );

    if (!subCategory) {
      throw new Error(`Sub category '${product.subCategory}' not found under '${category.name}'`);
    }

    const miniCategory = await this.miniCategoryRepo.findByNameAndSubCategory(
      product.miniCategory,
      subCategory.id,
    );

    if (!miniCategory) {
      throw new Error(
        `Mini category '${product.miniCategory}' not found under '${subCategory.name}'`,
      );
    }

    const brand = await this.brandRepo.findByName(product.brand);

    if (!brand) {
      throw new Error(`Brand '${product.brand}' not found`);
    }

    const resolvedImages = await this.resolveImportImages(product);

    const dto = {
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

      mainImage: resolvedImages.mainImage,

      images: resolvedImages.gallery.map((url, index) => ({
        url,
        sortOrder: index,
      })),

      variants: resolvedImages.variants.map((variant) => ({
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

        mainImage: variant.mainImage,

        images: variant.gallery.map((url, index) => ({
          url,
          sortOrder: index,
        })),
      })),
    };

    console.log('[Import] Final DTO mainImage:', dto.mainImage);
    console.log('[Import] Final DTO gallery count:', dto.images.length);

    return dto;
  }

  // =======================
  // 🖼 S3 IMAGE LOOKUP
  // =======================

  private async resolveImportImages(product: ParsedProduct) {
    console.log('[Import] Before image resolution:', product.name);
    console.log('[Import] Current mainImage:', product.images.main);

    if (isPlaceholderImageUrl(product.images.main)) {
      console.log(
        '[Import] Placeholder Excel image detected, S3 lookup will take priority:',
        product.images.main,
      );
    }

    const s3ProductBundle = await this.productS3ImageResolverService.resolveProductImages(
      product.name,
    );

    const productBundle = mergeProductImageBundle(
      s3ProductBundle,
      product.images.main,
      product.images.gallery,
    );

    console.log('[Import] Merged product bundle:', productBundle);

    const variants = await Promise.all(
      product.variants.map(async (variant) => {
        console.log('[Import] Before variant image resolution:', variant.name);
        console.log('[Import] Current variant mainImage:', variant.images.main);

        const s3VariantBundle = await this.productS3ImageResolverService.resolveVariantImages(
          product.name,
          variant.name,
          productBundle,
        );

        const variantBundle = mergeVariantImageBundle(
          s3VariantBundle,
          variant.images.main,
          variant.images.gallery,
          productBundle,
        );

        console.log('[Import] Merged variant bundle:', variantBundle);

        return {
          ...variant,
          mainImage: variantBundle.mainImage,
          gallery: variantBundle.galleryImages,
        };
      }),
    );

    return {
      mainImage: productBundle.mainImage,
      gallery: productBundle.galleryImages,
      variants,
    };
  }
}

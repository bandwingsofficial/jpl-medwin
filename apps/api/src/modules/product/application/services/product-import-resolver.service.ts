// src/modules/product/application/services/product-import-resolver.service.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { CreateCategoryUseCase } from '@/modules/category/application/usecases/category/create-category.usecase';
import { CreateSubCategoryUseCase } from '@/modules/category/application/usecases/sub-category/create-sub-category.usecase';
import { CreateMiniCategoryUseCase } from '@/modules/category/application/usecases/mini-category/create-mini-category.usecase';
import { MiniCategory } from '@/modules/category/domain/entities/mini-category.entity';
import { SubCategory } from '@/modules/category/domain/entities/sub-category.entity';
import { CreateBrandUseCase } from '@/modules/brand/application/use-cases/create-brand.use-case';
import { BrandSkuPrefixService } from '@/modules/brand/domain/services/brand-sku-prefix.service';
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { SubCategoryRepository } from '@/modules/category/domain/repositories/sub-category.repository';
import { MiniCategoryRepository } from '@/modules/category/domain/repositories/mini-category.repository';
import { BrandRepository } from '@/modules/brand/domain/repositories/brand.repository';

import { ParsedProduct } from '../types/product-import.types';

import { parseCustomerType } from '../../domain/enums/customer-type.enum';

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

private readonly createCategoryUseCase: CreateCategoryUseCase,
private readonly createSubCategoryUseCase: CreateSubCategoryUseCase,
private readonly createMiniCategoryUseCase: CreateMiniCategoryUseCase,

private readonly createBrandUseCase: CreateBrandUseCase,
private readonly brandSkuPrefixService: BrandSkuPrefixService,
  ) {}

  // =======================
  // 🔥 RESOLVE PRODUCT
  // =======================

  async resolve(product: ParsedProduct) {
   let category = await this.categoryRepo.findByName(product.category);

if (!category) {
  category = await this.createCategoryUseCase.execute({
    name: product.category,
  });
}

let subCategory: SubCategory | null = null;

if (product.subCategory) {
  subCategory = await this.subCategoryRepo.findByNameAndCategory(
    product.subCategory,
    category.id,
  );

  if (!subCategory) {
    subCategory = await this.createSubCategoryUseCase.execute({
      categoryId: category.id,
      name: product.subCategory,
    });
  }
}

let miniCategory: MiniCategory | null = null;

if (product.miniCategory && subCategory) {
  miniCategory =
    await this.miniCategoryRepo.findByNameAndSubCategory(
      product.miniCategory,
      subCategory.id,
    );

  if (!miniCategory) {
    miniCategory = await this.createMiniCategoryUseCase.execute({
      categoryId: category.id,
      subCategoryId: subCategory.id,
      name: product.miniCategory,
    });
  }
}

let brand = await this.brandRepo.findByName(product.brand);

if (!brand) {
  const skuPrefix =
    await this.brandSkuPrefixService.resolveUniquePrefix(product.brand);

  brand = await this.createBrandUseCase.execute({
    name: product.brand,
    skuPrefix,
  });
}

    const customerType = parseCustomerType(product.customerType);

    const resolvedImages = await this.resolveImportImages(product);

    const dto = {
      name: product.name,

      type: product.type,

      customerType,

      categoryId: category.id,

      subCategoryId: subCategory?.id ?? null,

      miniCategoryId: miniCategory?.id ?? null,

      brandId: brand.id,

      hsnCode: product.hsnCode || undefined,

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

      isReturnable: product.isReturnable !== false,

      isOverweight: product.isOverweight ?? false,

      weightKg: product.weightKg ?? null,

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

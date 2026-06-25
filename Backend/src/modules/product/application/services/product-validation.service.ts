import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository';
import { SubCategoryRepository } from '@/modules/category/domain/repositories/sub-category.repository';
import { MiniCategoryRepository } from '@/modules/category/domain/repositories/mini-category.repository';
import { BrandRepository } from '@/modules/brand/domain/repositories/brand.repository';

import { CategoryNotFoundException } from '@/modules/category/domain/exceptions/category-not-found.exception';
import { SubCategoryNotFoundException } from '@/modules/category/domain/exceptions/sub-category-not-found.exception';
import { MiniCategoryNotFoundException } from '@/modules/category/domain/exceptions/mini-category-not-found.exception';
import { InvalidCategoryHierarchyException } from '@/modules/category/domain/exceptions/invalid-category-hierarchy.exception';

import { BrandNotFoundException } from '@/modules/brand/domain/exceptions/brand-not-found.exception';

@Injectable()
export class ProductValidationService {
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

  async validate(input: {
    categoryId: string;
    subCategoryId: string;
    miniCategoryId: string;
    brandId: string;
  }) {
    // 🔥 avoid findById(undefined)
    if (!input.categoryId) {
      throw new CategoryNotFoundException({
        categoryId: input.categoryId,
      });
    }

    if (!input.subCategoryId) {
      throw new SubCategoryNotFoundException({
        subCategoryId: input.subCategoryId,
      });
    }

    if (!input.miniCategoryId) {
      throw new MiniCategoryNotFoundException({
        miniCategoryId: input.miniCategoryId,
      });
    }

    if (!input.brandId) {
      throw new BrandNotFoundException({
        brandId: input.brandId,
      });
    }

    const [category, sub, mini, brand] = await Promise.all([
      this.categoryRepo.findById(input.categoryId),
      this.subCategoryRepo.findById(input.subCategoryId),
      this.miniCategoryRepo.findById(input.miniCategoryId),
      this.brandRepo.findById(input.brandId),
    ]);

    if (!category) {
      throw new CategoryNotFoundException({
        categoryId: input.categoryId,
      });
    }

    if (!sub) {
      throw new SubCategoryNotFoundException({
        subCategoryId: input.subCategoryId,
      });
    }

    if (!mini) {
      throw new MiniCategoryNotFoundException({
        miniCategoryId: input.miniCategoryId,
      });
    }

    if (!brand) {
      throw new BrandNotFoundException({
        brandId: input.brandId,
      });
    }

    if (sub.categoryId !== category.id) {
      throw new InvalidCategoryHierarchyException({
        categoryId: category.id,
        subCategoryId: sub.id,
      });
    }

    if (mini.subCategoryId !== sub.id) {
      throw new InvalidCategoryHierarchyException({
        subCategoryId: sub.id,
        miniCategoryId: mini.id,
      });
    }

    return {
      category,
      subCategory: sub,
      miniCategory: mini,
      brand,
    };
  }
}

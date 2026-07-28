import { Inject, Injectable, HttpStatus } from '@nestjs/common';

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
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

import { CustomerType } from '../../domain/enums/customer-type.enum';

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
    miniCategoryId?: string | null;
    brandId: string;
    customerType?: CustomerType;
  }) {
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

    if (!input.brandId) {
      throw new BrandNotFoundException({
        brandId: input.brandId,
      });
    }

    if (!input.customerType) {
      throw new BaseException(
        'Customer Type is required.',
        ErrorCode.PRODUCT.INVALID,
        HttpStatus.BAD_REQUEST,
        { field: 'customerType' },
      );
    }

    const [category, sub, brand] = await Promise.all([
      this.categoryRepo.findById(input.categoryId),
      this.subCategoryRepo.findById(input.subCategoryId),
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

    if (!brand) {
      throw new BrandNotFoundException({
        brandId: input.brandId,
      });
    }

    if (!brand.skuPrefix?.trim()) {
      throw new BaseException(
        'Brand SKU Prefix not configured.',
        ErrorCode.BRAND.INVALID,
        HttpStatus.BAD_REQUEST,
        { field: 'brandId' },
      );
    }

    if (sub.categoryId !== category.id) {
      throw new InvalidCategoryHierarchyException({
        categoryId: category.id,
        subCategoryId: sub.id,
      });
    }

    let mini: Awaited<ReturnType<MiniCategoryRepository['findById']>> = null;

    if (input.miniCategoryId) {
      mini = await this.miniCategoryRepo.findById(input.miniCategoryId);

      if (!mini) {
        throw new MiniCategoryNotFoundException({
          miniCategoryId: input.miniCategoryId,
        });
      }

      if (mini.subCategoryId !== sub.id) {
        throw new InvalidCategoryHierarchyException({
          subCategoryId: sub.id,
          miniCategoryId: mini.id,
        });
      }
    }

    return {
      category,
      subCategory: sub,
      miniCategory: mini,
      brand,
    };
  }
}

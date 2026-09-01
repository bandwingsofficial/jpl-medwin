import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { SubCategory } from '../../../domain/entities/sub-category.entity';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { SubCategoryS3ImageResolverService } from '../../services/sub-category-s3-image-resolver.service';

@Injectable()
export class GetSubCategoriesUseCase {
  constructor(
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,
@Inject(TOKENS.CATEGORY_REPO)
private readonly categoryRepo: CategoryRepository,
    private readonly subCategoryS3ImageResolverService: SubCategoryS3ImageResolverService,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(params?: {
    categoryId?: string;
    onlyActive?: boolean;
     categorySlug?: string;
  }): Promise<SubCategory[]> {
   const {
  categoryId,
  categorySlug,
  onlyActive = true,
} = params || {};

let subs: SubCategory[];

if (categorySlug) {
  const category = await this.categoryRepo.findBySlug(categorySlug);

  if (!category || category.isDeleted?.()) {
    throw new CategoryNotFoundException({
  slug: categorySlug,
});
  }

  subs = await this.subRepo.findByCategoryId(category.id);
} else if (categoryId) {
  subs = await this.subRepo.findByCategoryId(categoryId);
} else {
  subs = await this.subRepo.findAll();
}

    for (const subCategory of subs) {
      if (subCategory.imageUrl) {
        continue;
      }

      const image =
        await this.subCategoryS3ImageResolverService.resolveImage(
          subCategory.slug,
        );

      if (image) {
        subCategory.imageUrl = image;
      }
    }

    return subs.filter(
      (s) => !s.isDeleted?.() && (!onlyActive || s.status === 'ACTIVE'),
    );
  }
}
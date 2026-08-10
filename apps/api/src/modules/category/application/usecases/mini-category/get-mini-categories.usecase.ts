import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { MiniCategoryRepository } from '../../../domain/repositories/mini-category.repository';
import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { MiniCategory } from '../../../domain/entities/mini-category.entity';
import { SubCategoryNotFoundException } from '../../../domain/exceptions/sub-category-not-found.exception';

import { MiniCategoryS3ImageResolverService } from '../../services/mini-category-s3-image-resolver.service';

@Injectable()
export class GetMiniCategoriesUseCase {
  constructor(
    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,
@Inject(TOKENS.CATEGORY_REPO)
private readonly categoryRepo: CategoryRepository,
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,

    private readonly miniCategoryS3ImageResolverService: MiniCategoryS3ImageResolverService,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(params?: {
    subCategoryId?: string;
     categorySlug?: string;
  subCategorySlug?: string;
    onlyActive?: boolean;
  }): Promise<MiniCategory[]> {
    const {
  subCategoryId,
  categorySlug,
  subCategorySlug,
  onlyActive = true,
} = params || {};

let minis: MiniCategory[];

if (categorySlug && subCategorySlug) {
  const category = await this.categoryRepo.findBySlug(categorySlug);

  if (!category || category.isDeleted?.()) {
    throw new CategoryNotFoundException({
  slug: categorySlug,
});
  }

  const sub = await this.subRepo.findBySlug(
    category.id,
    subCategorySlug,
  );

  if (!sub || sub.isDeleted?.()) {
    throw new SubCategoryNotFoundException({
  categoryId: category.id,
  slug: subCategorySlug,
});
  }

  minis = await this.miniRepo.findBySubCategoryId(sub.id);
} else if (subCategoryId) {
  const sub = await this.subRepo.findById(subCategoryId);

  if (!sub || sub.isDeleted?.()) {
    throw new SubCategoryNotFoundException({
      subCategoryId,
    });
  }

  minis = await this.miniRepo.findBySubCategoryId(subCategoryId);
} else {
  minis = await this.miniRepo.findAll();
}

    for (const miniCategory of minis) {
      if (miniCategory.imageUrl) {
        continue;
      }

      const image =
        await this.miniCategoryS3ImageResolverService.resolveImage(
          miniCategory.slug,
        );

      if (image) {
        miniCategory.imageUrl = image;
      }
    }

    return minis.filter(
      (m) => !m.isDeleted?.() && (!onlyActive || m.status === 'ACTIVE'),
    );
  }
}
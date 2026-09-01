import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { Category } from '../../../domain/entities/category.entity';

import { CategoryS3ImageResolverService } from '../../services/category-s3-image-resolver.service';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly categoryS3ImageResolverService: CategoryS3ImageResolverService,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(onlyActive: boolean = true): Promise<Category[]> {
    const categories = await this.categoryRepo.findAll();

    for (const category of categories) {
      if (category.imageUrl) {
        continue;
      }

      const image = await this.categoryS3ImageResolverService.resolveImage(
        category.slug,
      );

      if (image) {
        category.imageUrl = image;
      }
    }

    return categories.filter(
      (c) => !c.isDeleted?.() && (!onlyActive || c.status === 'ACTIVE'),
    );
  }
}
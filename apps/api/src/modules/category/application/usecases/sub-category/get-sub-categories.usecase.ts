import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { SubCategory } from '../../../domain/entities/sub-category.entity';

@Injectable()
export class GetSubCategoriesUseCase {
  constructor(
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(params?: { categoryId?: string; onlyActive?: boolean }): Promise<SubCategory[]> {
    const { categoryId, onlyActive = true } = params || {};

    let subs: SubCategory[];

    if (categoryId) {
      subs = await this.subRepo.findByCategoryId(categoryId);
    } else {
      subs = await this.subRepo.findAll();
    }

    return subs.filter((s) => !s.isDeleted?.() && (!onlyActive || s.status === 'ACTIVE'));
  }
}

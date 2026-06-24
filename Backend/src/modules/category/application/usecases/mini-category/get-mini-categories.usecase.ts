import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { MiniCategoryRepository } from '../../../domain/repositories/mini-category.repository';
import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';

import { MiniCategory } from '../../../domain/entities/mini-category.entity';
import { SubCategoryNotFoundException } from '../../../domain/exceptions/sub-category-not-found.exception';

@Injectable()
export class GetMiniCategoriesUseCase {
  constructor(
    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,

    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(params?: {
    subCategoryId?: string;
    onlyActive?: boolean;
  }): Promise<MiniCategory[]> {
    const { subCategoryId, onlyActive = true } = params || {};

    let minis: MiniCategory[];

    // =======================
    // 🔹 Filter by subCategory
    // =======================
    if (subCategoryId) {
      const sub = await this.subRepo.findById(subCategoryId);

      if (!sub || sub.isDeleted?.()) {
        throw new SubCategoryNotFoundException({ subCategoryId });
      }

      minis = await this.miniRepo.findBySubCategoryId(subCategoryId);
    } else {
      minis = await this.miniRepo.findAll();
    }

    // =======================
    // 🔒 FINAL FILTER
    // =======================
    return minis.filter((m) => !m.isDeleted?.() && (!onlyActive || m.status === 'ACTIVE'));
  }
}

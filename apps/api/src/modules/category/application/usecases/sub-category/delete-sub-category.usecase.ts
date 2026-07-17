import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { SubCategoryNotFoundException } from '../../../domain/exceptions/sub-category-not-found.exception';

@Injectable()
export class DeleteSubCategoryUseCase {
  constructor(
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(subCategoryId: string, force = false, preview = false) {
    const sub = await this.subRepo.findById(subCategoryId);

    if (!sub || sub.isDeleted?.()) {
      throw new SubCategoryNotFoundException({ subCategoryId });
    }

    // =======================
    // 🔍 PREVIEW
    // =======================
    if (preview) {
      const count = await this.domainService.getMiniCountBySubCategory(subCategoryId);

      return {
        message: count
          ? 'Preview: subcategory has children'
          : 'Preview: subcategory has no children',
        miniCount: count,
      };
    }

    // =======================
    // 💥 FORCE DELETE (CASCADE)
    // =======================
    if (force) {
      await this.domainService.deleteSubCategoryTree(subCategoryId);

      return {
        message: 'SubCategory deleted with cascade',
      };
    }

    // =======================
    // 🔒 SAFE DELETE
    // =======================
    await this.domainService.validateSubCategoryDeletion(subCategoryId);

    await this.subRepo.delete(subCategoryId);

    return {
      message: 'SubCategory deleted successfully',
    };
  }
}

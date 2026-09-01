import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(categoryId: string, force = false, preview = false) {
    const category = await this.categoryRepo.findById(categoryId);

    if (!category || category.isDeleted?.()) {
      throw new CategoryNotFoundException({ categoryId });
    }

    // =======================
    // 🔍 PREVIEW
    // =======================
    if (preview) {
      const info = await this.domainService.getCategoryChildrenInfo(categoryId);

      return {
        message: info.hasChildren
          ? 'Preview: category has children'
          : 'Preview: category has no children',
        ...info,
      };
    }

    // =======================
    // 🔒 SAFE DELETE
    // =======================
    if (!force) {
      await this.domainService.validateCategoryDeletion(categoryId);

      // ✅ no children → simple delete
      await this.categoryRepo.delete(categoryId);
    }

    // =======================
    // 💥 FORCE DELETE (CASCADE)
    // =======================
    else {
      await this.domainService.deleteCategoryTree(categoryId);
    }

    return {
      message: force ? 'Category deleted with cascade' : 'Category deleted successfully',
    };
  }
}

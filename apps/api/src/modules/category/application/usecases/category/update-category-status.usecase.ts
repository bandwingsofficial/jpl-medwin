import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { CategoryStatus } from '../../../domain/enums/category-status.enum';

@Injectable()
export class UpdateCategoryStatusUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(input: { id: string; status: CategoryStatus }) {
    const category = await this.categoryRepo.findById(input.id);

    if (!category) {
      throw new CategoryNotFoundException({
        categoryId: input.id,
      });
    }

    // =======================
    // ⚡ NO-OP (same status)
    // =======================
    if (category.status === input.status) {
      return category;
    }

    // =======================
    // 🔴 DEACTIVATE (CASCADE)
    // =======================
    if (input.status === CategoryStatus.INACTIVE) {
      await this.domainService.deactivateCategoryTree(input.id);
    }

    // =======================
    // 🟢 ACTIVATE
    // =======================
    else {
      category.activate();
      await this.categoryRepo.update(category);
    }

    // =======================
    // ✅ RETURN UPDATED
    // =======================
    return this.categoryRepo.findById(input.id);
  }
}

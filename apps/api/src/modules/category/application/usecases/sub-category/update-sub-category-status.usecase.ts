import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { SubCategoryNotFoundException } from '../../../domain/exceptions/sub-category-not-found.exception';
import { CategoryStatus } from '../../../domain/enums/category-status.enum';

@Injectable()
export class UpdateSubCategoryStatusUseCase {
  constructor(
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,

    private readonly domainService: CategoryDomainService,

    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(input: { id: string; status: CategoryStatus }) {
    const sub = await this.subRepo.findById(input.id);

    if (!sub) {
      throw new SubCategoryNotFoundException({
        subCategoryId: input.id,
      });
    }

    // =======================
    // ⚡ NO-OP
    // =======================
    if (sub.status === input.status) {
      return sub;
    }

    // =======================
    // 🔴 DEACTIVATE (CASCADE)
    // =======================
    if (input.status === CategoryStatus.INACTIVE) {
      await this.domainService.deactivateSubCategoryTree(input.id);
    }

    // =======================
    // 🟢 ACTIVATE (WITH PARENT CHECK)
    // =======================
    else {
      // 🔥 Fetch parent category
      const category = await this.categoryRepo.findById(sub.categoryId);

      // 🔥 Validate parent is active
      this.domainService.validateCategoryActive(category!);

      sub.activate();
      await this.subRepo.update(sub);
    }

    return this.subRepo.findById(input.id);
  }
}

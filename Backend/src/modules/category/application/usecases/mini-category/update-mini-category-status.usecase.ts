import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { MiniCategoryRepository } from '../../../domain/repositories/mini-category.repository';
import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { MiniCategoryNotFoundException } from '../../../domain/exceptions/mini-category-not-found.exception';
import { CategoryStatus } from '../../../domain/enums/category-status.enum';

@Injectable()
export class UpdateMiniCategoryStatusUseCase {
  constructor(
    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,

    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,

    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(input: { id: string; status: CategoryStatus }) {
    const mini = await this.miniRepo.findById(input.id);

    if (!mini) {
      throw new MiniCategoryNotFoundException({
        miniCategoryId: input.id,
      });
    }

    // =======================
    // ⚡ NO-OP
    // =======================
    if (mini.status === input.status) {
      return mini;
    }

    // =======================
    // 🔴 DEACTIVATE
    // =======================
    if (input.status === CategoryStatus.INACTIVE) {
      await this.domainService.deactivateMiniCategory(input.id);
    }

    // =======================
    // 🟢 ACTIVATE (WITH FULL VALIDATION)
    // =======================
    else {
      // 🔥 1. Check SubCategory
      const sub = await this.subRepo.findById(mini.subCategoryId);
      this.domainService.validateSubCategoryActive(sub!);

      // 🔥 2. Check Category
      const category = await this.categoryRepo.findById(mini.categoryId);
      this.domainService.validateCategoryActive(category!);

      // 🔥 3. Activate
      mini.activate();
      await this.miniRepo.update(mini);
    }

    return this.miniRepo.findById(input.id);
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { Category } from '../../../domain/entities/category.entity';

@Injectable()
export class GetCategoriesUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(onlyActive: boolean = true): Promise<Category[]> {
    const categories = await this.categoryRepo.findAll();

    return categories.filter((c) => !c.isDeleted?.() && (!onlyActive || c.status === 'ACTIVE'));
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { MiniCategoryRepository } from '../../../domain/repositories/mini-category.repository';
import { MiniCategoryNotFoundException } from '../../../domain/exceptions/mini-category-not-found.exception';

@Injectable()
export class DeleteMiniCategoryUseCase {
  constructor(
    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,
  ) {}

  async execute(miniCategoryId: string, force = false, preview = false) {
    const mini = await this.miniRepo.findById(miniCategoryId);

    if (!mini || mini.isDeleted?.()) {
      throw new MiniCategoryNotFoundException({
        miniCategoryId,
      });
    }

    // =======================
    // 🔍 PREVIEW
    // =======================
    if (preview) {
      return {
        message: 'Preview: mini category can be deleted',
        hasChildren: false,
      };
    }

    // =======================
    // 🗑 DELETE (SOFT)
    // =======================
    await this.miniRepo.delete(miniCategoryId);

    return {
      message: force ? 'MiniCategory deleted (forced)' : 'MiniCategory deleted successfully',
    };
  }
}

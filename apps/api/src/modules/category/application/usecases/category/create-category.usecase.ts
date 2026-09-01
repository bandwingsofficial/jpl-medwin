import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { Category } from '../../../domain/entities/category.entity';
import { SlugVO } from '../../../domain/value-objects/slug.vo';

import { CategoryStatus } from '../../../domain/enums/category-status.enum';
import { CategorySlugExistsException } from '../../../domain/exceptions/category-slug-exists.exception';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,
  ) {}

  async execute(input: {
    name: string;
    slug?: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }): Promise<Category> {
    // =======================
    // 🔹 1. SLUG RESOLUTION
    // =======================

    const baseSlug = input.slug
      ? new SlugVO(input.slug).getValue()
      : new SlugVO(input.name).getValue();

    // =======================
    // 🆕 2. CREATE FIRST (FAST PATH)
    // =======================

    const category = new Category(
      crypto.randomUUID(),
      input.name,
      baseSlug,
      input.imageUrl,
      input.description,
      input.metaDescription ?? input.description,
    );

    try {
      return await this.categoryRepo.create(category);
    } catch (err: any) {
      // =======================
      // 🔥 HANDLE DUPLICATE (ONLY IF NEEDED)
      // =======================

      if (err?.code === 'P2002') {
        const existing = await this.categoryRepo.findBySlugIncludingDeleted(baseSlug);

        if (!existing) throw err;

        // ❌ already ACTIVE → block
        if (!existing.isDeleted()) {
          throw new CategorySlugExistsException({ slug: baseSlug });
        }

        // ♻️ RESTORE
        existing.name = input.name;
        existing.slug = baseSlug;

        existing.imageUrl = input.imageUrl;
        existing.description = input.description;
        existing.metaDescription = input.metaDescription ?? input.description;

        existing.deletedAt = undefined;
        existing.status = CategoryStatus.ACTIVE;

        return this.categoryRepo.update(existing);
      }

      throw err;
    }
  }
}

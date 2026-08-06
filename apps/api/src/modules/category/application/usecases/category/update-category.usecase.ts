import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { CategoryNotFoundException } from '../../../domain/exceptions/category-not-found.exception';
import { CategorySlugExistsException } from '../../../domain/exceptions/category-slug-exists.exception';

import { SlugVO } from '../../../domain/value-objects/slug.vo';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(input: {
    id: string;
    name?: string;
    slug?: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }) {
    const category = await this.categoryRepo.findById(input.id);

    if (!category) {
      throw new CategoryNotFoundException({
        categoryId: input.id,
      });
    }

    let newSlug: string | undefined;

    // =======================
    // 🔥 DETERMINE TARGET SLUG
    // =======================

    if (input.slug) {
      newSlug = new SlugVO(input.slug).getValue();
    } else if (input.name) {
      newSlug = new SlugVO(input.name).getValue();
    }

    // =======================
    // 🔥 VALIDATE ONLY IF CHANGED
    // =======================

    if (newSlug && newSlug !== category.slug) {
      const existing = await this.categoryRepo.findBySlug(newSlug);

      if (existing && existing.id !== category.id) {
        throw new CategorySlugExistsException({
          slug: newSlug,
        });
      }
    } else {
      newSlug = undefined; // no change
    }

    // =======================
    // 🧱 APPLY UPDATES
    // =======================

    if (input.name) category.name = input.name;
    if (newSlug) category.slug = newSlug;

    if (input.imageUrl !== undefined) category.imageUrl = input.imageUrl;
    if (input.description !== undefined) {
      category.description = input.description;
    }
    if (input.metaDescription !== undefined) {
      category.metaDescription = input.metaDescription;
    }

    // =======================
    // 💾 SAVE
    // =======================

    try {
      return await this.categoryRepo.update(category);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new CategorySlugExistsException({
          slug: newSlug ?? category.slug,
        });
      }
      throw err;
    }
  }
}

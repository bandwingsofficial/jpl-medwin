import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { SubCategoryNotFoundException } from '../../../domain/exceptions/sub-category-not-found.exception';
import { SubCategorySlugExistsException } from '../../../domain/exceptions/sub-category-slug-exists.exception';

import { SlugVO } from '../../../domain/value-objects/slug.vo';

@Injectable()
export class UpdateSubCategoryUseCase {
  constructor(
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subRepo: SubCategoryRepository,

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
    // =======================
    // 🔹 FETCH + VALIDATE
    // =======================

    const sub = await this.subRepo.findById(input.id);

    if (!sub) {
      throw new SubCategoryNotFoundException({
        subCategoryId: input.id,
      });
    }

    const category = await this.categoryRepo.findById(sub.categoryId);
    this.domainService.validateCategoryActive(category!);

    // =======================
    // 🔥 DETERMINE TARGET SLUG
    // =======================

    let newSlug: string | undefined;

    if (input.slug) {
      newSlug = new SlugVO(input.slug).getValue();
    } else if (input.name) {
      newSlug = new SlugVO(input.name).getValue();
    }

    // =======================
    // 🔥 VALIDATE ONLY IF CHANGED
    // =======================

    if (newSlug && newSlug !== sub.slug) {
      const existing = await this.subRepo.findBySlug(sub.categoryId, newSlug);

      if (existing && existing.id !== sub.id) {
        throw new SubCategorySlugExistsException({
          slug: newSlug,
        });
      }
    } else {
      newSlug = undefined;
    }

    // =======================
    // 🧱 APPLY UPDATES
    // =======================

    if (input.name) sub.name = input.name;
    if (newSlug) sub.slug = newSlug;

    if (input.imageUrl !== undefined) sub.imageUrl = input.imageUrl;

    if (input.description !== undefined) {
      sub.description = input.description;
    }

    if (input.metaDescription !== undefined) {
      sub.metaDescription = input.metaDescription;
    }

    // =======================
    // 💾 SAVE
    // =======================

    try {
      return await this.subRepo.update(sub);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new SubCategorySlugExistsException({
          slug: newSlug ?? sub.slug,
        });
      }
      throw err;
    }
  }
}

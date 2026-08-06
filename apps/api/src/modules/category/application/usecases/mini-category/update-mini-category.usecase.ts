import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../../../domain/repositories/category.repository';
import { SubCategoryRepository } from '../../../domain/repositories/sub-category.repository';
import { MiniCategoryRepository } from '../../../domain/repositories/mini-category.repository';

import { CategoryDomainService } from '../../../domain/services/category.domain-service';

import { MiniCategoryNotFoundException } from '../../../domain/exceptions/mini-category-not-found.exception';
import { MiniCategorySlugExistsException } from '../../../domain/exceptions/mini-category-slug-exists.exception';

import { SlugVO } from '../../../domain/value-objects/slug.vo';

@Injectable()
export class UpdateMiniCategoryUseCase {
  constructor(
    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,

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
    // 🔹 FETCH MINI
    // =======================

    const mini = await this.miniRepo.findById(input.id);

    if (!mini) {
      throw new MiniCategoryNotFoundException({
        miniCategoryId: input.id,
      });
    }

    // =======================
    // 🔹 FETCH HIERARCHY (PARALLEL ⚡)
    // =======================

    const [sub, category] = await Promise.all([
      this.subRepo.findById(mini.subCategoryId),
      this.categoryRepo.findById(mini.categoryId),
    ]);

    this.domainService.validateCategoryActive(category!);

    this.domainService.validateSubCategoryHierarchy({
      subCategory: sub!,
      categoryId: mini.categoryId,
    });

    // =======================
    // 🔥 DETERMINE SLUG
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

    if (newSlug && newSlug !== mini.slug) {
      const existing = await this.miniRepo.findBySlug(mini.subCategoryId, newSlug);

      if (existing && existing.id !== mini.id) {
        throw new MiniCategorySlugExistsException({
          slug: newSlug,
        });
      }
    } else {
      newSlug = undefined;
    }

    // =======================
    // 🧱 APPLY UPDATES
    // =======================

    if (input.name) mini.name = input.name;
    if (newSlug) mini.slug = newSlug;

    if (input.imageUrl !== undefined) mini.imageUrl = input.imageUrl;

    if (input.description !== undefined) {
      mini.description = input.description;
    }

    if (input.metaDescription !== undefined) {
      mini.metaDescription = input.metaDescription;
    }

    // =======================
    // 💾 SAVE
    // =======================

    try {
      return await this.miniRepo.update(mini);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new MiniCategorySlugExistsException({
          slug: newSlug ?? mini.slug,
        });
      }
      throw err;
    }
  }
}

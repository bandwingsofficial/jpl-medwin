import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { MiniCategoryRepository } from '../../../../category/domain/repositories/mini-category.repository';
import { SubCategoryRepository } from '../../../../category/domain/repositories/sub-category.repository';
import { CategoryRepository } from '../../../../category/domain/repositories/category.repository';
import { CategoryDomainService } from '../../../../category/domain/services/category.domain-service';

import { MiniCategory } from '../../../../category/domain/entities/mini-category.entity';
import { SlugVO } from '../../../../category/domain/value-objects/slug.vo';

import { CategoryNotFoundException } from '../../../../category/domain/exceptions/category-not-found.exception';
import { SubCategoryNotFoundException } from '../../../../category/domain/exceptions/sub-category-not-found.exception';
import { MiniCategorySlugExistsException } from '../../../../category/domain/exceptions/mini-category-slug-exists.exception';

import { CategoryStatus } from '../../../../category/domain/enums/category-status.enum';

@Injectable()
export class CreateMiniCategoryUseCase {
  constructor(
    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniRepo: MiniCategoryRepository,

    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subCategoryRepo: SubCategoryRepository,

    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(input: {
    categoryId: string;
    subCategoryId: string;
    name: string;
    slug?: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }): Promise<MiniCategory> {
    // =======================
    // 🔹 1. VALIDATE CATEGORY + SUBCATEGORY (PARALLEL ⚡)
    // =======================

    const [category, subCategory] = await Promise.all([
      this.categoryRepo.findById(input.categoryId),
      this.subCategoryRepo.findById(input.subCategoryId),
    ]);

    if (!category) {
      throw new CategoryNotFoundException({
        categoryId: input.categoryId,
      });
    }

    if (!subCategory) {
      throw new SubCategoryNotFoundException({
        subCategoryId: input.subCategoryId,
      });
    }

    this.domainService.validateCategoryActive(category);

    this.domainService.validateSubCategoryHierarchy({
      subCategory,
      categoryId: input.categoryId,
    });

    // =======================
    // 🔹 2. SLUG RESOLUTION
    // =======================

    const baseSlug = input.slug
      ? new SlugVO(input.slug).getValue()
      : new SlugVO(input.name).getValue();

    // =======================
    // 🔥 3. PARALLEL DUPLICATE CHECKS
    // =======================

    const [existingByName, existing] = await Promise.all([
      this.miniRepo.findByNameAndSubCategory(input.name, input.subCategoryId),
      this.miniRepo.findBySlugIncludingDeleted(input.subCategoryId, baseSlug),
    ]);

    // =======================
    // 🔥 4. NAME DUPLICATE
    // =======================

    if (existingByName && !existingByName.isDeleted()) {
      return existingByName;
    }

    // =======================
    // 🔥 5. SLUG CHECK
    // =======================

    if (existing) {
      if (!existing.isDeleted()) {
        throw new MiniCategorySlugExistsException({
          slug: baseSlug,
        });
      }

      // ♻️ RESTORE
      existing.name = input.name;
      existing.slug = baseSlug;

      existing.imageUrl = input.imageUrl;
      existing.description = input.description;
      existing.metaDescription = input.metaDescription ?? input.description;

      existing.deletedAt = undefined;
      existing.status = CategoryStatus.ACTIVE;

      return this.miniRepo.update(existing);
    }

    // =======================
    // 🆕 6. CREATE
    // =======================

    const miniCategory = new MiniCategory(
      crypto.randomUUID(),
      input.categoryId,
      input.subCategoryId,
      input.name,
      baseSlug,
      input.imageUrl,
      input.description,
      input.metaDescription ?? input.description,
    );

    try {
      return await this.miniRepo.create(miniCategory);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new MiniCategorySlugExistsException({
          slug: baseSlug,
        });
      }
      throw err;
    }
  }
}

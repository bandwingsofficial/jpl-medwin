import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { SubCategoryRepository } from '../../../../category/domain/repositories/sub-category.repository';
import { CategoryRepository } from '../../../../category/domain/repositories/category.repository';
import { CategoryDomainService } from '../../../../category/domain/services/category.domain-service';

import { SubCategory } from '../../../../category/domain/entities/sub-category.entity';
import { SlugVO } from '../../../../category/domain/value-objects/slug.vo';

import { CategoryNotFoundException } from '../../../../category/domain/exceptions/category-not-found.exception';
import { SubCategorySlugExistsException } from '../../../../category/domain/exceptions/sub-category-slug-exists.exception';

import { CategoryStatus } from '../../../../category/domain/enums/category-status.enum';

@Injectable()
export class CreateSubCategoryUseCase {
  constructor(
    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subCategoryRepo: SubCategoryRepository,

    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    private readonly domainService: CategoryDomainService,
  ) {}

  async execute(input: {
    categoryId: string;
    name: string;
    slug?: string;
    imageUrl?: string;
    description?: string;
    metaDescription?: string;
  }): Promise<SubCategory> {
    // =======================
    // 🔹 1. VALIDATE PARENT
    // =======================

    const category = await this.categoryRepo.findById(input.categoryId);

    if (!category) {
      throw new CategoryNotFoundException({
        categoryId: input.categoryId,
      });
    }

    this.domainService.validateCategoryActive(category);

    // =======================
    // 🔹 2. SLUG RESOLUTION
    // =======================

    const baseSlug = input.slug
      ? new SlugVO(input.slug).getValue()
      : new SlugVO(input.name).getValue();

    // =======================
    // 🔥 3. PARALLEL CHECKS (BIG FIX ⚡)
    // =======================

    const [existingByName, existing] = await Promise.all([
      this.subCategoryRepo.findByNameAndCategory(input.name, input.categoryId),
      this.subCategoryRepo.findBySlugIncludingDeleted(input.categoryId, baseSlug),
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
        throw new SubCategorySlugExistsException({
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

      return this.subCategoryRepo.update(existing);
    }

    // =======================
    // 🆕 6. CREATE
    // =======================

    const subCategory = new SubCategory(
      crypto.randomUUID(),
      input.categoryId,
      input.name,
      baseSlug,
      input.imageUrl,
      input.description,
      input.metaDescription ?? input.description,
    );

    try {
      return await this.subCategoryRepo.create(subCategory);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new SubCategorySlugExistsException({
          slug: baseSlug,
        });
      }
      throw err;
    }
  }
}

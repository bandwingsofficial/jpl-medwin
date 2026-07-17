import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';

import { CategoryRepository } from '../repositories/category.repository';
import { SubCategoryRepository } from '../repositories/sub-category.repository';
import { MiniCategoryRepository } from '../repositories/mini-category.repository';

import { Category } from '../entities/category.entity';
import { SubCategory } from '../entities/sub-category.entity';

import { CategorySlugExistsException } from '../exceptions/category-slug-exists.exception';
import { InvalidCategoryHierarchyException } from '../exceptions/invalid-category-hierarchy.exception';
import { CategoryHasChildrenException } from '../exceptions/category-has-children.exception';

@Injectable()
export class CategoryDomainService {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,

    @Inject(TOKENS.SUB_CATEGORY_REPO)
    private readonly subCategoryRepo: SubCategoryRepository,

    @Inject(TOKENS.MINI_CATEGORY_REPO)
    private readonly miniCategoryRepo: MiniCategoryRepository,
  ) {}

  // =======================
  // 🔒 SLUG VALIDATION
  // =======================

  async validateCategorySlug(slug: string): Promise<void> {
    if (await this.categoryRepo.existsBySlug(slug)) {
      throw new CategorySlugExistsException({ slug });
    }
  }

  async validateSubCategorySlug(categoryId: string, slug: string): Promise<void> {
    if (await this.subCategoryRepo.existsBySlug(categoryId, slug)) {
      throw new CategorySlugExistsException({ slug });
    }
  }

  async validateMiniCategorySlug(subCategoryId: string, slug: string): Promise<void> {
    if (await this.miniCategoryRepo.existsBySlug(subCategoryId, slug)) {
      throw new CategorySlugExistsException({ slug });
    }
  }

  // =======================
  // 🧠 HIERARCHY VALIDATION
  // =======================

  validateSubCategoryHierarchy(params: {
    subCategory: SubCategory | null;
    categoryId: string;
  }): void {
    const { subCategory, categoryId } = params;

    if (!subCategory || subCategory.categoryId !== categoryId) {
      throw new InvalidCategoryHierarchyException({
        categoryId,
        subCategoryId: subCategory?.id,
      });
    }
  }

  // =======================
  // 🛡 STATUS VALIDATION
  // =======================

  validateCategoryActive(category: Category): void {
    if (!category) return;
    category.ensureActive();
  }

  validateSubCategoryActive(sub: SubCategory): void {
    if (!sub) return;
    sub.ensureActive();
  }

  // =======================
  // 🔍 PREVIEW SUPPORT
  // =======================

  async getCategoryChildrenInfo(categoryId: string) {
    const subCount = await this.subCategoryRepo.countByCategoryId(categoryId);
    const miniCount = await this.miniCategoryRepo.countByCategoryId(categoryId);

    return {
      subCount,
      miniCount,
      hasChildren: subCount > 0 || miniCount > 0,
    };
  }

  async getSubCategoryChildrenInfo(subCategoryId: string) {
    const miniCount = await this.miniCategoryRepo.countBySubCategoryId(subCategoryId);

    return {
      miniCount,
      hasChildren: miniCount > 0,
    };
  }

  async getMiniCountBySubCategory(subCategoryId: string) {
    return this.miniCategoryRepo.countBySubCategoryId(subCategoryId);
  }

  // =======================
  // 🔒 DELETE VALIDATION
  // =======================

  async validateCategoryDeletion(categoryId: string): Promise<void> {
    const count = await this.subCategoryRepo.countByCategoryId(categoryId);

    if (count > 0) {
      throw new CategoryHasChildrenException({
        categoryId,
        childrenCount: count,
      });
    }
  }

  async validateSubCategoryDeletion(subCategoryId: string): Promise<void> {
    const count = await this.miniCategoryRepo.countBySubCategoryId(subCategoryId);

    if (count > 0) {
      throw new CategoryHasChildrenException({
        subCategoryId,
        childrenCount: count,
      });
    }
  }

  // =======================
  // 🔥 STATUS CASCADE
  // =======================

  async deactivateCategoryTree(categoryId: string): Promise<void> {
    const category = await this.categoryRepo.findById(categoryId);
    if (!category) return;

    category.deactivate();
    await this.categoryRepo.update(category);

    const subs = await this.subCategoryRepo.findByCategoryId(categoryId);

    for (const sub of subs) {
      await this.deactivateSubCategoryTree(sub.id);
    }
  }

  async deactivateSubCategoryTree(subCategoryId: string): Promise<void> {
    const sub = await this.subCategoryRepo.findById(subCategoryId);
    if (!sub) return;

    sub.deactivate();
    await this.subCategoryRepo.update(sub);

    const minis = await this.miniCategoryRepo.findBySubCategoryId(subCategoryId);

    for (const mini of minis) {
      mini.deactivate();
      await this.miniCategoryRepo.update(mini);
    }
  }

  async deactivateMiniCategory(miniCategoryId: string): Promise<void> {
    const mini = await this.miniCategoryRepo.findById(miniCategoryId);
    if (!mini) return;

    mini.deactivate();
    await this.miniCategoryRepo.update(mini);
  }

  // =======================
  // 🗑 DELETE CASCADE (NEW)
  // =======================

  async deleteCategoryTree(categoryId: string): Promise<void> {
    const subs = await this.subCategoryRepo.findByCategoryId(categoryId);

    for (const sub of subs) {
      await this.deleteSubCategoryTree(sub.id);
    }

    await this.categoryRepo.delete(categoryId);
  }

  async deleteSubCategoryTree(subCategoryId: string): Promise<void> {
    const minis = await this.miniCategoryRepo.findBySubCategoryId(subCategoryId);

    for (const mini of minis) {
      await this.miniCategoryRepo.delete(mini.id);
    }

    await this.subCategoryRepo.delete(subCategoryId);
  }
}

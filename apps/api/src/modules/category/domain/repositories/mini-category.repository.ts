import { MiniCategory } from '../entities/mini-category.entity';

export interface MiniCategoryRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<MiniCategory | null>;

  findBySlug(subCategoryId: string, slug: string): Promise<MiniCategory | null>;

  findBySlugIncludingDeleted(subCategoryId: string, slug: string): Promise<MiniCategory | null>;

  findByNameAndSubCategory(name: string, subCategoryId: string): Promise<MiniCategory | null>;

  findBySubCategoryId(subCategoryId: string): Promise<MiniCategory[]>;

  findAll(): Promise<MiniCategory[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsBySlug(subCategoryId: string, slug: string): Promise<boolean>;

  existsBySubCategoryId(subCategoryId: string): Promise<boolean>;

  // 🔥 NEW (VERY IMPORTANT)
  countBySubCategoryId(subCategoryId: string): Promise<number>;

  countByCategoryId(categoryId: string): Promise<number>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(miniCategory: MiniCategory): Promise<MiniCategory>;

  update(miniCategory: MiniCategory): Promise<MiniCategory>;

  // =======================
  // ❌ DELETE
  // =======================

  delete(id: string): Promise<void>;
}

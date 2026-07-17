import { SubCategory } from '../entities/sub-category.entity';

export interface SubCategoryRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<SubCategory | null>;

  findBySlug(categoryId: string, slug: string): Promise<SubCategory | null>;

  findByNameAndCategory(name: string, categoryId: string): Promise<SubCategory | null>;

  findBySlugIncludingDeleted(categoryId: string, slug: string): Promise<SubCategory | null>;

  findByCategoryId(categoryId: string): Promise<SubCategory[]>;

  findAll(): Promise<SubCategory[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsBySlug(categoryId: string, slug: string): Promise<boolean>;

  existsByCategoryId(categoryId: string): Promise<boolean>;

  // 🔥 NEW (IMPORTANT)
  countByCategoryId(categoryId: string): Promise<number>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(subCategory: SubCategory): Promise<SubCategory>;

  update(subCategory: SubCategory): Promise<SubCategory>;

  // =======================
  // ❌ DELETE
  // =======================

  delete(id: string): Promise<void>;
}

import { Category } from '../entities/category.entity';
import { SubCategory } from '../entities/sub-category.entity';
import { MiniCategory } from '../entities/mini-category.entity';

export interface CategoryRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;

  findAll(): Promise<Category[]>; // ✅ added

    findByName(
    name: string,
  ): Promise<Category | null>;


  // =======================
  // 🧠 CHECKS
  // =======================

  existsBySlug(slug: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(category: Category): Promise<Category>;
  update(category: Category): Promise<Category>;

  // =======================
  // ❌ DELETE (soft)
  // =======================

  delete(id: string): Promise<void>;

  // =======================
  // 🌳 TREE
  // =======================

  findFullTree(): Promise<{
    categories: Category[];
    subCategories: SubCategory[];
    miniCategories: MiniCategory[];
  }>;

  findBySlugIncludingDeleted(slug: string): Promise<Category | null>;
}

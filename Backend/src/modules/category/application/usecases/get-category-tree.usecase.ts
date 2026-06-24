import { Inject, Injectable } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';
import { CategoryRepository } from '../../domain/repositories/category.repository';

// =======================
// 📦 DTO TYPES
// =======================

type MiniDTO = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  status: string;
  subCategoryId: string;
  subCategoryName: string | null;
  categoryId: string | null;
  categoryName: string | null;
};

type SubDTO = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  status: string;
  categoryId: string;
  categoryName: string | null;
  children: MiniDTO[];
};

type CategoryTreeDTO = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  status: string;
  children: SubDTO[];
};

@Injectable()
export class GetCategoryTreeUseCase {
  constructor(
    @Inject(TOKENS.CATEGORY_REPO)
    private readonly categoryRepo: CategoryRepository,
  ) {}

  /**
   * onlyActive = true  → Public API
   * onlyActive = false → Admin API
   */
  async execute(onlyActive: boolean = true): Promise<CategoryTreeDTO[]> {
    const { categories, subCategories, miniCategories } = await this.categoryRepo.findFullTree();

    // =======================
    // 🔒 FILTER (deleted + active)
    // =======================

    const safeCategories = categories.filter(
      (c) => !c.isDeleted?.() && (!onlyActive || c.status === 'ACTIVE'),
    );

    const safeSubs = subCategories.filter(
      (s) => !s.isDeleted?.() && (!onlyActive || s.status === 'ACTIVE'),
    );

    const safeMinis = miniCategories.filter(
      (m) => !m.isDeleted?.() && (!onlyActive || m.status === 'ACTIVE'),
    );

    // =======================
    // 🧠 LOOKUP MAPS
    // =======================

    const categoryMap = new Map(safeCategories.map((c) => [c.id, c]));

    const subCategoryMap = new Map(safeSubs.map((s) => [s.id, s]));

    const subMap = new Map<string, SubDTO[]>();
    const miniMap = new Map<string, MiniDTO[]>();

    // =======================
    // 🔹 MINI → GROUP
    // =======================

    for (const mini of safeMinis) {
      const sub = subCategoryMap.get(mini.subCategoryId);
      if (!sub) continue; // 🚨 prevent orphan data

      const category = categoryMap.get(sub.categoryId);
      if (!category) continue; // 🚨 prevent orphan data

      if (!miniMap.has(mini.subCategoryId)) {
        miniMap.set(mini.subCategoryId, []);
      }

      miniMap.get(mini.subCategoryId)!.push({
        id: mini.id,
        name: mini.name,
        slug: mini.slug,
        imageUrl: mini.imageUrl ?? null,
        status: mini.status,
        subCategoryId: mini.subCategoryId,
        subCategoryName: sub.name,
        categoryId: category.id,
        categoryName: category.name,
      });
    }

    // =======================
    // 🔹 SUB → GROUP
    // =======================

    for (const sub of safeSubs) {
      const category = categoryMap.get(sub.categoryId);
      if (!category) continue; // 🚨 prevent orphan data

      if (!subMap.has(sub.categoryId)) {
        subMap.set(sub.categoryId, []);
      }

      subMap.get(sub.categoryId)!.push({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        imageUrl: sub.imageUrl ?? null,
        status: sub.status,
        categoryId: sub.categoryId,
        categoryName: category.name,
        children: miniMap.get(sub.id) ?? [],
      });
    }

    // =======================
    // 🔹 FINAL TREE
    // =======================

    return safeCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      imageUrl: cat.imageUrl ?? null,
      status: cat.status,
      children: subMap.get(cat.id) ?? [],
    }));
  }
}

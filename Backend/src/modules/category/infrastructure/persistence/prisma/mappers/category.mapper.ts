import {
  Category as PrismaCategory,
  SubCategory as PrismaSubCategory,
  MiniCategory as PrismaMiniCategory,
  CategoryStatus as PrismaCategoryStatus,
} from '@prisma/client';

import { Category } from '../../../../domain/entities/category.entity';
import { SubCategory } from '../../../../domain/entities/sub-category.entity';
import { MiniCategory } from '../../../../domain/entities/mini-category.entity';

import { CategoryStatus } from '../../../../domain/enums/category-status.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class CategoryMapper {
  // =======================
  // 🔄 ENUM MAPPING
  // =======================

  private static toDomainStatus(status: PrismaCategoryStatus): CategoryStatus {
    switch (status) {
      case PrismaCategoryStatus.ACTIVE:
        return CategoryStatus.ACTIVE;
      case PrismaCategoryStatus.INACTIVE:
        return CategoryStatus.INACTIVE;
      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma status', value: status, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaStatus(status: CategoryStatus): PrismaCategoryStatus {
    switch (status) {
      case CategoryStatus.ACTIVE:
        return PrismaCategoryStatus.ACTIVE;
      case CategoryStatus.INACTIVE:
        return PrismaCategoryStatus.INACTIVE;
      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain status', value: status, direction: 'domain_to_prisma' });
    }
  }

  // =======================
  // 🟦 CATEGORY
  // =======================

  static toDomainCategory(p: PrismaCategory): Category {
    return new Category(
      p.id,
      p.name,
      p.slug,
      p.imageUrl ?? undefined,
      p.description ?? undefined,
      p.metaDescription ?? undefined,
      this.toDomainStatus(p.status),
      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );
  }

  static toPersistenceCategory(e: Category) {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      imageUrl: e.imageUrl ?? null,
      description: e.description ?? null,
      metaDescription: e.metaDescription ?? null,
      status: this.toPrismaStatus(e.status),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }

  // =======================
  // 🟨 SUB CATEGORY
  // =======================

  static toDomainSubCategory(p: PrismaSubCategory & { categoryName?: string | null }): SubCategory {
    const sub = new SubCategory(
      p.id,
      p.categoryId,
      p.name,
      p.slug,
      p.imageUrl ?? undefined,
      p.description ?? undefined,
      p.metaDescription ?? undefined,
      this.toDomainStatus(p.status),
      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );

    // ✅ enrichment
    sub.categoryName = p.categoryName ?? undefined;

    return sub;
  }

  /**
   * 🔥 IMPORTANT CHANGE:
   * Do NOT include categoryId directly when using Prisma `connect`
   */
  static toPersistenceSubCategory(e: SubCategory) {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      imageUrl: e.imageUrl ?? null,
      description: e.description ?? null,
      metaDescription: e.metaDescription ?? null,
      status: this.toPrismaStatus(e.status),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,

      // ❌ removed categoryId (handled via relation connect)
    };
  }

  /**
   * 🔥 NEW: relation builder (clean + reusable)
   */
  static subCategoryRelation(e: SubCategory) {
    return {
      category: {
        connect: { id: e.categoryId },
      },
    };
  }

  // =======================
  // 🟥 MINI CATEGORY
  // =======================

  static toDomainMiniCategory(
    p: PrismaMiniCategory & {
      categoryName?: string | null;
      subCategoryName?: string | null;
    },
  ): MiniCategory {
    const mini = new MiniCategory(
      p.id,
      p.categoryId,
      p.subCategoryId,
      p.name,
      p.slug,
      p.imageUrl ?? undefined,
      p.description ?? undefined,
      p.metaDescription ?? undefined,
      this.toDomainStatus(p.status),
      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );

    mini.categoryName = p.categoryName ?? undefined;
    mini.subCategoryName = p.subCategoryName ?? undefined;

    return mini;
  }

  static toPersistenceMiniCategory(e: MiniCategory) {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      imageUrl: e.imageUrl ?? null,
      description: e.description ?? null,
      metaDescription: e.metaDescription ?? null,
      status: this.toPrismaStatus(e.status),
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,

      // ❌ removed categoryId & subCategoryId
    };
  }

  /**
   * 🔥 NEW: mini relations
   */
  static miniCategoryRelation(e: MiniCategory) {
    return {
      category: {
        connect: { id: e.categoryId },
      },
      subCategory: {
        connect: { id: e.subCategoryId },
      },
    };
  }
}

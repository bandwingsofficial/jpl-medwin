import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { CategoryRepository } from '../../../../domain/repositories/category.repository';
import { Category } from '../../../../domain/entities/category.entity';

import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Category | null> {
    // 🔥 use primary index (faster than findFirst)
    const data = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!data || data.deletedAt) return null;

    return CategoryMapper.toDomainCategory(data);
  }
  // =======================
  // 🔍 FIND BY NAME
  // =======================

  async findByName(name: string): Promise<Category | null> {
    const data = await this.prisma.category.findFirst({
      where: {
        deletedAt: null,
        name: {
          equals: name.trim(),
          mode: 'insensitive',
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return data ? CategoryMapper.toDomainCategory(data) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const data = await this.prisma.category.findFirst({
      where: { slug, deletedAt: null },
      orderBy: { createdAt: 'desc' }, // ⚡ stable + faster selection
    });

    return data ? CategoryMapper.toDomainCategory(data) : null;
  }

  // 🔥 INCLUDING DELETED (optimized ordering)
  async findBySlugIncludingDeleted(slug: string): Promise<Category | null> {
    const data = await this.prisma.category.findFirst({
      where: { slug },
      orderBy: { deletedAt: 'asc' }, // ⚡ active comes first
    });

    return data ? CategoryMapper.toDomainCategory(data) : null;
  }

  async findAll(): Promise<Category[]> {
    const data = await this.prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((c) => CategoryMapper.toDomainCategory(c));
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsBySlug(slug: string): Promise<boolean> {
    // 🔥 faster than count
    const data = await this.prisma.category.findFirst({
      where: { slug, deletedAt: null },
      select: { id: true },
    });

    return !!data;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(category: Category): Promise<Category> {
    const data = await this.prisma.category.create({
      data: CategoryMapper.toPersistenceCategory(category),
    });

    return CategoryMapper.toDomainCategory(data);
  }

  async update(category: Category): Promise<Category> {
    const data = await this.prisma.category.update({
      where: { id: category.id },
      data: CategoryMapper.toPersistenceCategory(category),
    });

    return CategoryMapper.toDomainCategory(data);
  }

  // =======================
  // ❌ DELETE (SOFT + CASCADE)
  // =======================

  async delete(id: string): Promise<void> {
    const now = new Date();

    await this.prisma.$transaction([
      this.prisma.category.update({
        where: { id },
        data: {
          deletedAt: now,
          status: 'INACTIVE',
        },
      }),

      this.prisma.subCategory.updateMany({
        where: { categoryId: id, deletedAt: null },
        data: {
          deletedAt: now,
          status: 'INACTIVE',
        },
      }),

      this.prisma.miniCategory.updateMany({
        where: { categoryId: id, deletedAt: null },
        data: {
          deletedAt: now,
          status: 'INACTIVE',
        },
      }),
    ]);
  }

  // =======================
  // 🌳 FULL TREE
  // =======================

  async findFullTree() {
    const [categories, subCategories, miniCategories] = await Promise.all([
      this.prisma.category.findMany({
        where: { deletedAt: null, status: 'ACTIVE' },
      }),
      this.prisma.subCategory.findMany({
        where: { deletedAt: null, status: 'ACTIVE' },
      }),
      this.prisma.miniCategory.findMany({
        where: { deletedAt: null, status: 'ACTIVE' },
      }),
    ]);

    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const subCategoryMap = new Map(subCategories.map((s) => [s.id, s]));

    const mappedCategories = categories.map((c) => CategoryMapper.toDomainCategory(c));

    const mappedSubCategories = subCategories.map((sub) => {
      const category = categoryMap.get(sub.categoryId);

      return CategoryMapper.toDomainSubCategory({
        ...sub,
        categoryName: category?.name ?? null,
      });
    });

    const mappedMiniCategories = miniCategories.map((mini) => {
      const sub = subCategoryMap.get(mini.subCategoryId);
      const category = sub ? categoryMap.get(sub.categoryId) : undefined;

      return CategoryMapper.toDomainMiniCategory({
        ...mini,
        subCategoryName: sub?.name ?? null,
        categoryName: category?.name ?? null,
      });
    });

    return {
      categories: mappedCategories,
      subCategories: mappedSubCategories,
      miniCategories: mappedMiniCategories,
    };
  }
}

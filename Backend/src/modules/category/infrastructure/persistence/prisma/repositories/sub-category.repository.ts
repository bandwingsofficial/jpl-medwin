import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { SubCategoryRepository } from '../../../../domain/repositories/sub-category.repository';
import { SubCategory } from '../../../../domain/entities/sub-category.entity';

import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaSubCategoryRepository implements SubCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<SubCategory | null> {
    const data = await this.prisma.subCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    if (!data || data.deletedAt) return null;

    return CategoryMapper.toDomainSubCategory({
      ...data,
      categoryName: data.category?.name ?? null,
    });
  }

  async findBySlug(categoryId: string, slug: string): Promise<SubCategory | null> {
    const data = await this.prisma.subCategory.findFirst({
      where: { categoryId, slug, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    return data
      ? CategoryMapper.toDomainSubCategory({
          ...data,
          categoryName: data.category?.name ?? null,
        })
      : null;
  }

  async findBySlugIncludingDeleted(categoryId: string, slug: string): Promise<SubCategory | null> {
    const data = await this.prisma.subCategory.findFirst({
      where: { categoryId, slug },
      orderBy: { deletedAt: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    return data
      ? CategoryMapper.toDomainSubCategory({
          ...data,
          categoryName: data.category?.name ?? null,
        })
      : null;
  }

  // =======================
// 🔍 FIND BY NAME + CATEGORY
// =======================

async findByNameAndCategory(
  name: string,
  categoryId: string,
): Promise<SubCategory | null> {
  const data = await this.prisma.subCategory.findFirst({
    where: {
      categoryId,
      deletedAt: null,

      name: {
        equals: name.trim(),
        mode: 'insensitive',
      },
    },

    orderBy: {
      createdAt: 'desc',
    },

    select: {
      id: true,
      name: true,
      slug: true,
      categoryId: true,
      imageUrl: true,
      description: true,
      metaDescription: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,

      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return data
    ? CategoryMapper.toDomainSubCategory({
        ...data,
        categoryName: data.category?.name ?? null,
      })
    : null;
}

  async findByCategoryId(categoryId: string): Promise<SubCategory[]> {
    const data = await this.prisma.subCategory.findMany({
      where: { categoryId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    return data.map((d) =>
      CategoryMapper.toDomainSubCategory({
        ...d,
        categoryName: d.category?.name ?? null,
      }),
    );
  }

  async findAll(): Promise<SubCategory[]> {
    const data = await this.prisma.subCategory.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    return data.map((d) =>
      CategoryMapper.toDomainSubCategory({
        ...d,
        categoryName: d.category?.name ?? null,
      }),
    );
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsBySlug(categoryId: string, slug: string): Promise<boolean> {
    const data = await this.prisma.subCategory.findFirst({
      where: { categoryId, slug, deletedAt: null },
      select: { id: true },
    });

    return !!data;
  }

  async existsByCategoryId(categoryId: string): Promise<boolean> {
    const data = await this.prisma.subCategory.findFirst({
      where: { categoryId, deletedAt: null },
      select: { id: true },
    });

    return !!data;
  }

  async countByCategoryId(categoryId: string): Promise<number> {
    return this.prisma.subCategory.count({
      where: { categoryId, deletedAt: null },
    });
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(entity: SubCategory): Promise<SubCategory> {
    const data = await this.prisma.subCategory.create({
      data: {
        ...CategoryMapper.toPersistenceSubCategory(entity),
        ...CategoryMapper.subCategoryRelation(entity), // ✅ correct mapper usage
      },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    return CategoryMapper.toDomainSubCategory({
      ...data,
      categoryName: data.category?.name ?? null,
    });
  }

  async update(entity: SubCategory): Promise<SubCategory> {
    const data = await this.prisma.subCategory.update({
      where: { id: entity.id },
      data: CategoryMapper.toPersistenceSubCategory(entity),
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
      },
    });

    return CategoryMapper.toDomainSubCategory({
      ...data,
      categoryName: data.category?.name ?? null,
    });
  }

  // =======================
  // ❌ DELETE (CASCADE)
  // =======================

  async delete(id: string): Promise<void> {
    const now = new Date();

    await this.prisma.$transaction([
      this.prisma.miniCategory.updateMany({
        where: { subCategoryId: id, deletedAt: null },
        data: {
          deletedAt: now,
          status: 'INACTIVE',
        },
      }),

      this.prisma.subCategory.update({
        where: { id },
        data: {
          deletedAt: now,
          status: 'INACTIVE',
        },
      }),
    ]);
  }
}

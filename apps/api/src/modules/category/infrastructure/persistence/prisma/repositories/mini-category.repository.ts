import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { MiniCategoryRepository } from '../../../../domain/repositories/mini-category.repository';
import { MiniCategory } from '../../../../domain/entities/mini-category.entity';

import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class PrismaMiniCategoryRepository implements MiniCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<MiniCategory | null> {
    const data = await this.prisma.miniCategory.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    if (!data || data.deletedAt) return null;

    return CategoryMapper.toDomainMiniCategory({
      ...data,
      categoryName: data.category?.name ?? null,
      subCategoryName: data.subCategory?.name ?? null,
    });
  }

  async findBySlug(subCategoryId: string, slug: string): Promise<MiniCategory | null> {
    const data = await this.prisma.miniCategory.findFirst({
      where: { subCategoryId, slug, deletedAt: null },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    return data
      ? CategoryMapper.toDomainMiniCategory({
          ...data,
          categoryName: data.category?.name ?? null,
          subCategoryName: data.subCategory?.name ?? null,
        })
      : null;
  }

  async findBySlugIncludingDeleted(
    subCategoryId: string,
    slug: string,
  ): Promise<MiniCategory | null> {
    const data = await this.prisma.miniCategory.findFirst({
      where: { subCategoryId, slug },
      orderBy: { deletedAt: 'asc' }, // ⚡ active first
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    return data
      ? CategoryMapper.toDomainMiniCategory({
          ...data,
          categoryName: data.category?.name ?? null,
          subCategoryName: data.subCategory?.name ?? null,
        })
      : null;
  }

  // =======================
  // 🔍 FIND BY NAME + SUBCATEGORY
  // =======================

  async findByNameAndSubCategory(
    name: string,
    subCategoryId: string,
  ): Promise<MiniCategory | null> {
    const data = await this.prisma.miniCategory.findFirst({
      where: {
        subCategoryId,
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
        subCategoryId: true,
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

        subCategory: {
          select: {
            name: true,
          },
        },
      },
    });

    return data
      ? CategoryMapper.toDomainMiniCategory({
          ...data,
          categoryName: data.category?.name ?? null,
          subCategoryName: data.subCategory?.name ?? null,
        })
      : null;
  }

  async findBySubCategoryId(subCategoryId: string): Promise<MiniCategory[]> {
    const data = await this.prisma.miniCategory.findMany({
      where: { subCategoryId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    return data.map((d) =>
      CategoryMapper.toDomainMiniCategory({
        ...d,
        categoryName: d.category?.name ?? null,
        subCategoryName: d.subCategory?.name ?? null,
      }),
    );
  }

  async findAll(): Promise<MiniCategory[]> {
    const data = await this.prisma.miniCategory.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    return data.map((d) =>
      CategoryMapper.toDomainMiniCategory({
        ...d,
        categoryName: d.category?.name ?? null,
        subCategoryName: d.subCategory?.name ?? null,
      }),
    );
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsBySlug(subCategoryId: string, slug: string): Promise<boolean> {
    const data = await this.prisma.miniCategory.findFirst({
      where: { subCategoryId, slug, deletedAt: null },
      select: { id: true },
    });

    return !!data;
  }

  async existsBySubCategoryId(subCategoryId: string): Promise<boolean> {
    const data = await this.prisma.miniCategory.findFirst({
      where: { subCategoryId, deletedAt: null },
      select: { id: true },
    });

    return !!data;
  }

  async countBySubCategoryId(subCategoryId: string): Promise<number> {
    return this.prisma.miniCategory.count({
      where: { subCategoryId, deletedAt: null },
    });
  }

  async countByCategoryId(categoryId: string): Promise<number> {
    return this.prisma.miniCategory.count({
      where: { categoryId, deletedAt: null },
    });
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(entity: MiniCategory): Promise<MiniCategory> {
    const data = await this.prisma.miniCategory.create({
      data: {
        ...CategoryMapper.toPersistenceMiniCategory(entity),
        ...CategoryMapper.miniCategoryRelation(entity), // ✅ mapper usage
      },
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    return CategoryMapper.toDomainMiniCategory({
      ...data,
      categoryName: data.category?.name ?? null,
      subCategoryName: data.subCategory?.name ?? null,
    });
  }

  async update(entity: MiniCategory): Promise<MiniCategory> {
    const data = await this.prisma.miniCategory.update({
      where: { id: entity.id },
      data: CategoryMapper.toPersistenceMiniCategory(entity),
      select: {
        id: true,
        name: true,
        slug: true,
        categoryId: true,
        subCategoryId: true,
        imageUrl: true,
        description: true,
        metaDescription: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: { select: { name: true } },
        subCategory: { select: { name: true } },
      },
    });

    return CategoryMapper.toDomainMiniCategory({
      ...data,
      categoryName: data.category?.name ?? null,
      subCategoryName: data.subCategory?.name ?? null,
    });
  }

  // =======================
  // ❌ DELETE
  // =======================

  async delete(id: string): Promise<void> {
    await this.prisma.miniCategory.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }
}

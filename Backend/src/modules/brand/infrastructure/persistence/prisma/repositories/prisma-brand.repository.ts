import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { BrandRepository } from '../../../../domain/repositories/brand.repository';
import { Brand } from '../../../../domain/entities/brand.entity';

import { BrandMapper } from '../mappers/brand.mapper';

@Injectable()
export class PrismaBrandRepository implements BrandRepository {
  constructor(private readonly prisma: PrismaService) {}

  // =======================
  // 🔍 FIND
  // =======================

  async findById(id: string): Promise<Brand | null> {
    const data = await this.prisma.brand.findFirst({
      where: { id, deletedAt: null },
    });

    return data ? BrandMapper.toDomain(data) : null;
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    const data = await this.prisma.brand.findFirst({
      where: { slug, deletedAt: null },
    });

    return data ? BrandMapper.toDomain(data) : null;
  }

  // 🔥 NEW (FOR RESTORE FLOW)
  async findBySlugIncludingDeleted(slug: string): Promise<Brand | null> {
    const data = await this.prisma.brand.findFirst({
      where: { slug }, // ✅ includes deleted
    });

    return data ? BrandMapper.toDomain(data) : null;
  }

  // =======================
// 🔍 FIND BY NAME
// =======================

async findByName(
  name: string,
): Promise<Brand | null> {
  const data = await this.prisma.brand.findFirst({
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

  return data
    ? BrandMapper.toDomain(data)
    : null;
}

  async findAll(): Promise<Brand[]> {
    const data = await this.prisma.brand.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });

    return data.map((b) => BrandMapper.toDomain(b));
  }

  // =======================
  // 🧠 CHECKS
  // =======================

  async existsBySlug(slug: string): Promise<boolean> {
    const count = await this.prisma.brand.count({
      where: { slug, deletedAt: null },
    });

    return count > 0;
  }

  // =======================
  // ✍️ WRITE
  // =======================

  async create(brand: Brand): Promise<Brand> {
    const data = await this.prisma.brand.create({
      data: BrandMapper.toPersistence(brand),
    });

    return BrandMapper.toDomain(data);
  }

  async update(brand: Brand): Promise<Brand> {
    const data = await this.prisma.brand.update({
      where: { id: brand.id },
      data: BrandMapper.toPersistence(brand),
    });

    return BrandMapper.toDomain(data);
  }

  // =======================
  // ❌ DELETE (soft)
  // =======================

  async delete(id: string): Promise<void> {
    await this.prisma.brand.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }
}

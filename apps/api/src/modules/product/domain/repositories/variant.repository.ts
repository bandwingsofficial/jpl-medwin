import { Variant } from '../entities/variant.entity';
import { Prisma } from '@prisma/client';

// =======================
// 🔥 FULL VARIANT (READ MODEL)
// =======================

export type FullVariant = Prisma.VariantGetPayload<{
  include: {
    images: {
      where: { deletedAt: null };
      orderBy: { sortOrder: 'asc' };
    };
  };
}>;

// =======================
// 📦 REPOSITORY
// =======================

export interface VariantRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant | null>;

  findBySku(
    sku: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant | null>;

  findBySlug(
    slug: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant | null>;

  findByProduct(
    productId: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<Variant[]>;

  findMany(params?: {
    where?: Prisma.VariantWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.VariantOrderByWithRelationInput;
  }): Promise<FullVariant[]>; // 🔥 FIXED

  count(where?: Prisma.VariantWhereInput): Promise<number>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsBySku(
    sku: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  existsBySlug(
    slug: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(variant: Variant, tx?: Prisma.TransactionClient): Promise<Variant>;

  update(variant: Variant, tx?: Prisma.TransactionClient): Promise<Variant>;

  updateMany(variants: Variant[], tx?: Prisma.TransactionClient): Promise<void>;
  // =======================
  // 📦 STOCK
  // =======================

  updateStock(variantId: string, quantity: number, tx?: Prisma.TransactionClient): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  softDeleteByProduct(productId: string, tx?: Prisma.TransactionClient): Promise<void>;

  // =======================
  // 🔄 RESTORE
  // =======================

  restore(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

import { Product } from '../entities/product.entity';
import { Prisma } from '@prisma/client';

// =======================
// 🔥 FULL PRODUCT TYPE (READ MODEL)
// =======================

export type FullProduct = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    subCategory: true;
    miniCategory: true;

    images: {
      where: { deletedAt: null };
      orderBy: { sortOrder: 'asc' };
    };

    variants: {
      where: { deletedAt: null };
      orderBy: { createdAt: 'asc' };
      include: {
        images: {
          where: { deletedAt: null };
          orderBy: { sortOrder: 'asc' };
        };
      };
    };
  };
}>;

export type ProductFilters = {
  categoryId?: string;
  subCategoryId?: string;
  miniCategoryId?: string;
  brandId?: string;
  type?: string;
  status?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  tag?: string;
  skip?: number;
  take?: number;
  orderBy?: Prisma.ProductOrderByWithRelationInput;
};

// =======================
// 📦 REPOSITORY
// =======================

export interface ProductRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<Product | null>;

  findByIds(ids: string[], tx?: Prisma.TransactionClient): Promise<Product[]>;

  findFullById(id: string, tx?: Prisma.TransactionClient): Promise<FullProduct | null>;

  findBySlug(
    slug: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<Product | null>;

  findMany(params?: {
    where?: Prisma.ProductWhereInput;
    skip?: number;
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  }): Promise<FullProduct[]>; // 🔥 FIXED

  count(where?: Prisma.ProductWhereInput): Promise<number>;

  filter(filters: ProductFilters): Promise<FullProduct[]>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsBySlug(
    slug: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(product: Product, tx?: Prisma.TransactionClient): Promise<Product>;

  update(product: Product, tx?: Prisma.TransactionClient): Promise<Product>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  // =======================
  // 🔄 RESTORE
  // =======================

  restore(id: string, tx?: Prisma.TransactionClient): Promise<void>;
}

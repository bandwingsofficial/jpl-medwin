import { ProductImage } from '../entities/product-image.entity';
import { Prisma } from '@prisma/client';

// =======================
// 🔥 FULL IMAGE (READ MODEL)
// =======================

export type FullProductImage = Prisma.ProductImageGetPayload<{}>;

// =======================
// 📦 REPOSITORY
// =======================

export interface ProductImageRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(
    id: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage | null>;

  findByProduct(
    productId: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage[]>;

  findByVariant(
    variantId: string,
    includeDeleted?: boolean,
    tx?: Prisma.TransactionClient,
  ): Promise<ProductImage[]>;

  // 🔥 NEW
  findMainByProduct(productId: string, tx?: Prisma.TransactionClient): Promise<ProductImage | null>;

  // 🔥 NEW
  findMainByVariant(variantId: string, tx?: Prisma.TransactionClient): Promise<ProductImage | null>;

  findMany(params?: {
    where?: Prisma.ProductImageWhereInput;

    skip?: number;

    take?: number;

    orderBy?: Prisma.ProductImageOrderByWithRelationInput;
  }): Promise<FullProductImage[]>;

  count(where?: Prisma.ProductImageWhereInput): Promise<number>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(image: ProductImage, tx?: Prisma.TransactionClient): Promise<ProductImage>;

  update(image: ProductImage, tx?: Prisma.TransactionClient): Promise<ProductImage>;

  // =======================
  // ⚡ MAIN IMAGE CONTROL
  // =======================

  setMainImageForProduct(
    productId: string,
    imageId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  setMainImageForVariant(
    variantId: string,
    imageId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  softDeleteByProduct(productId: string, tx?: Prisma.TransactionClient): Promise<void>;

  softDeleteByVariant(variantId: string, tx?: Prisma.TransactionClient): Promise<void>;

  // =======================
  // 🔄 RESTORE
  // =======================

  restore(id: string, tx?: Prisma.TransactionClient): Promise<void>;

  softDeleteByVariantProduct(productId: string, tx?: Prisma.TransactionClient): Promise<void>;

  findByVariantIds(variantIds: string[], includeDeleted?: boolean): Promise<ProductImage[]>;
}

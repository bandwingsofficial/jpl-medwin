import {
  Product as PrismaProduct,
  Variant as PrismaVariant,
  ProductImage as PrismaProductImage,
  ProductStatus as PrismaProductStatus,
  ImageOwnerType as PrismaImageOwnerType,
  ImageType as PrismaImageType,
  ProductType as PrismaProductType,
  Prisma,
} from '@prisma/client';

import { Product } from '../../../../domain/entities/product.entity';
import { Variant } from '../../../../domain/entities/variant.entity';
import { ProductImage } from '../../../../domain/entities/product-image.entity';

import { ProductStatus } from '../../../../domain/enums/product-status.enum';
import { ImageOwnerType } from '../../../../domain/enums/image-owner-type.enum';
import { ImageType } from '../../../../domain/enums/image-type.enum';
import { ProductType } from '../../../../domain/enums/product-type.enum';

export class ProductMapper {
  // =======================
  // ENUM CASTS
  // =======================

  private static toDomainProductStatus(s: PrismaProductStatus) {
    return s as ProductStatus;
  }

  private static toPrismaProductStatus(s: ProductStatus) {
    return s as PrismaProductStatus;
  }

  private static toDomainProductType(t: PrismaProductType) {
    return t as ProductType;
  }

  private static toPrismaProductType(t: ProductType) {
    return t as PrismaProductType;
  }

  private static toDomainImageType(t: PrismaImageType) {
    return t as ImageType;
  }

  private static toPrismaImageType(t: ImageType) {
    return t as PrismaImageType;
  }

  private static toDomainOwnerType(t: PrismaImageOwnerType) {
    return t as ImageOwnerType;
  }

  private static toPrismaOwnerType(t: ImageOwnerType) {
    return t as PrismaImageOwnerType;
  }

  // =======================
  // 🔥 JSON SAFE PARSERS
  // =======================

  private static toSpecificationArray(
    value: Prisma.JsonValue | null,
  ): { key: string; value: string }[] | undefined {
    if (!Array.isArray(value)) return undefined;

    return value.map((item: any) => ({
      key: String(item?.key ?? ''),
      value: String(item?.value ?? ''),
    }));
  }

  private static toStringArray(value: Prisma.JsonValue | null): string[] | undefined {
    if (!Array.isArray(value)) return undefined;

    return value.map((v) => String(v));
  }

  private static toFaqArray(
    value: Prisma.JsonValue | null,
  ): { question: string; answer: string }[] | undefined {
    if (!Array.isArray(value)) return undefined;

    return value.map((item: any) => ({
      question: String(item?.question ?? ''),
      answer: String(item?.answer ?? ''),
    }));
  }

  private static toObject(value: Prisma.JsonValue | null) {
    return value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, any>)
      : undefined;
  }

  // =======================
  // PRODUCT
  // =======================

  static toDomainProduct(p: PrismaProduct): Product {
    return new Product(
      p.id,
      p.name,
      p.slug,
      this.toDomainProductType(p.type),

      p.categoryId,
      p.subCategoryId,
      p.miniCategoryId,
      p.brandId,

      p.defaultVariantId ?? undefined,

      p.shortDescription ?? undefined,
      p.longDescription ?? undefined,

      p.features ?? [],
      p.tags ?? [],
      p.displayNotes ?? [],

      this.toSpecificationArray(p.specifications),
      this.toStringArray(p.packing),
      this.toStringArray(p.directionOfUse),
      this.toStringArray(p.additionalInfo),
      this.toFaqArray(p.faq),

      p.minPrice ?? undefined,
      p.maxPrice ?? undefined,
      p.currency ?? 'INR',

      p.averageRating,
      p.reviewCount,

      p.isWeighted,
      p.warrantyMonths ?? undefined,

      this.toDomainProductStatus(p.status),

      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );
  }

  static toCreatePersistenceProduct(e: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: e.id,
      name: e.name,
      slug: e.slug,
      type: this.toPrismaProductType(e.type),

      categoryId: e.categoryId,
      subCategoryId: e.subCategoryId,
      miniCategoryId: e.miniCategoryId,
      brandId: e.brandId,

      defaultVariantId: e.defaultVariantId ?? null,

      shortDescription: e.shortDescription ?? null,
      longDescription: e.longDescription ?? null,

      features: e.features ?? [],
      tags: e.tags ?? [],
      displayNotes: e.displayNotes ?? [],

      specifications: e.specifications ?? Prisma.JsonNull,
      packing: e.packing ?? Prisma.JsonNull,
      directionOfUse: e.directionOfUse ?? Prisma.JsonNull,
      additionalInfo: e.additionalInfo ?? Prisma.JsonNull,
      faq: e.faq ?? Prisma.JsonNull,

      minPrice: e.minPrice ?? null,
      maxPrice: e.maxPrice ?? null,
      currency: e.currency ?? 'INR',

      averageRating: e.averageRating,
      reviewCount: e.reviewCount,

      isWeighted: e.isWeighted,
      warrantyMonths: e.warrantyMonths ?? null,

      status: this.toPrismaProductStatus(e.status),

      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }

  static toUpdatePersistenceProduct(e: Product): Prisma.ProductUncheckedUpdateInput {
    return {
      name: e.name,
      slug: e.slug,
      type: this.toPrismaProductType(e.type),

      categoryId: e.categoryId,
      subCategoryId: e.subCategoryId,
      miniCategoryId: e.miniCategoryId,
      brandId: e.brandId,

      defaultVariantId: e.defaultVariantId ?? null,

      shortDescription: e.shortDescription ?? null,
      longDescription: e.longDescription ?? null,

      features: e.features ?? [],
      tags: e.tags ?? [],
      displayNotes: e.displayNotes ?? [],

      specifications: e.specifications ?? Prisma.JsonNull,
      packing: e.packing ?? Prisma.JsonNull,
      directionOfUse: e.directionOfUse ?? Prisma.JsonNull,
      additionalInfo: e.additionalInfo ?? Prisma.JsonNull,
      faq: e.faq ?? Prisma.JsonNull,

      minPrice: e.minPrice ?? null,
      maxPrice: e.maxPrice ?? null,
      currency: e.currency ?? 'INR',

      averageRating: e.averageRating,
      reviewCount: e.reviewCount,

      isWeighted: e.isWeighted,
      warrantyMonths: e.warrantyMonths ?? null,

      status: this.toPrismaProductStatus(e.status),

      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }

  // =======================
  // VARIANT
  // =======================

  static toDomainVariant(p: PrismaVariant): Variant {
    return new Variant(
      p.id,

      p.productId,

      p.sku,
      p.name,
      p.slug,

      p.purchasePrice,
      p.sellingPrice,
      p.mrp,

      p.quantity,

      this.toObject(p.attributes),

      p.averageRating,
      p.reviewCount,

      p.isWeighted ?? false,
      p.warrantyMonths ?? null,

      this.toDomainProductStatus(p.status),

      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );
  }

  static toCreatePersistenceVariant(e: Variant): Prisma.VariantUncheckedCreateInput {
    return {
      id: e.id,
      productId: e.productId,
      sku: e.sku,
      name: e.name,
      slug: e.slug,

      purchasePrice: e.purchasePrice,
      sellingPrice: e.sellingPrice,
      mrp: e.mrp,

      quantity: e.quantity,

      attributes: e.attributes ?? Prisma.JsonNull,

      averageRating: e.averageRating,
      reviewCount: e.reviewCount,
      isWeighted: e.isWeighted,
      warrantyMonths: e.warrantyMonths ?? null,

      status: this.toPrismaProductStatus(e.status),

      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }

  static toUpdatePersistenceVariant(e: Variant): Prisma.VariantUncheckedUpdateInput {
    return {
      sku: e.sku,
      name: e.name,
      slug: e.slug,

      purchasePrice: e.purchasePrice,
      sellingPrice: e.sellingPrice,
      mrp: e.mrp,
      quantity: e.quantity,

      attributes: e.attributes ?? Prisma.JsonNull,
      averageRating: e.averageRating,
      reviewCount: e.reviewCount,
      isWeighted: e.isWeighted,
      warrantyMonths: e.warrantyMonths ?? null,
      status: this.toPrismaProductStatus(e.status),

      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }

  // =======================
  // IMAGE
  // =======================

  static toDomainImage(p: PrismaProductImage): ProductImage {
    return new ProductImage(
      p.id,
      p.url,
      ProductMapper.toDomainImageType(p.type),
      ProductMapper.toDomainOwnerType(p.ownerType),
      p.productId ?? undefined,
      p.variantId ?? undefined,
      p.alt ?? undefined,
      p.sortOrder,
      p.createdAt,
      p.updatedAt,
      p.deletedAt ?? undefined,
    );
  }

  static toCreatePersistenceImage(e: ProductImage): Prisma.ProductImageUncheckedCreateInput {
    return {
      id: e.id,
      url: e.url,
      type: this.toPrismaImageType(e.type),
      ownerType: this.toPrismaOwnerType(e.ownerType),
      productId: e.productId ?? null,
      variantId: e.variantId ?? null,
      alt: e.alt ?? null,
      sortOrder: e.sortOrder,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }

  static toUpdatePersistenceImage(e: ProductImage): Prisma.ProductImageUncheckedUpdateInput {
    return {
      url: e.url,
      type: this.toPrismaImageType(e.type),
      ownerType: this.toPrismaOwnerType(e.ownerType),
      productId: e.productId ?? null,
      variantId: e.variantId ?? null,
      alt: e.alt ?? null,
      sortOrder: e.sortOrder,
      updatedAt: e.updatedAt,
      deletedAt: e.deletedAt ?? null,
    };
  }
}

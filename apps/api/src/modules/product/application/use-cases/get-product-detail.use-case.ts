import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { ProductS3ImageResolverService } from '../services/product-s3-image-resolver.service';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { BrandRepository } from '@/modules/brand/domain/repositories/brand.repository';
import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

import { ProductStatus } from '../../domain/enums/product-status.enum';

@Injectable()
export class GetProductDetailUseCase {
 constructor(
   @Inject(TOKENS.PRODUCT_REPO)
   private readonly productRepo: ProductRepository,

   @Inject(TOKENS.BRAND_REPO)
   private readonly brandRepo: BrandRepository,

   @Inject(TOKENS.VARIANT_REPO)
   private readonly variantRepo: VariantRepository,

   @Inject(TOKENS.PRODUCT_IMAGE_REPO)
   private readonly imageRepo: ProductImageRepository,

   private readonly productS3ImageResolver: ProductS3ImageResolverService,
) {}

  async execute(
    id: string,

    onlyActive: boolean = false,
  ) {
    // =======================
    // 🔍 PRODUCT
    // =======================

    const product = await this.productRepo.findById(id, !onlyActive);
    

    if (!product) {
      throw new ProductNotFoundException({
        productId: id,
      });
    }
    console.log("========== PRODUCT ==========");
console.log(product.name);
console.log(product.slug);
console.log("=============================");

    // =======================
    // 🔒 PRODUCT FILTER
    // =======================

    if (product.isDeleted?.() || (onlyActive === true && product.status !== ProductStatus.ACTIVE)) {
      throw new ProductNotFoundException({
        productId: id,
      });
    }

    // =======================
    // 📦 LOAD DATA
    // =======================

    const [variants, productImages, brand] = await Promise.all([
  this.variantRepo.findByProduct(product.id, !onlyActive),

  this.imageRepo.findByProduct(product.id, !onlyActive),

  product.brandId
    ? this.brandRepo.findById(product.brandId)
    : null,
]);
    console.log("DB Product Images:", productImages.length);
console.log(productImages);

    // =======================
    // 🔒 SAFE VARIANTS
    // =======================

    const safeVariants = variants.filter((v) => {
      if (v.isDeleted?.()) {
        return false;
      }

      if (onlyActive === true && v.status !== ProductStatus.ACTIVE) {
        return false;
      }

      return true;
    });

    // =======================
    // 🖼 VARIANT IMAGES
    // =======================

    const variantImages = await this.imageRepo.findByVariantIds(
      safeVariants.map((v) => v.id),
      !onlyActive,
    );

    // =======================
    // 🧠 GROUP IMAGES
    // =======================

    const variantImagesMap = new Map<string, any[]>();

    for (const img of variantImages) {
      if (!img.variantId) continue;

      if (!variantImagesMap.has(img.variantId)) {
        variantImagesMap.set(img.variantId, []);
      }

      variantImagesMap.get(img.variantId)?.push(img);
    }

    // =======================
    // 🧠 PRICE RANGE
    // =======================

    const prices = safeVariants.map((v) => Number(v.sellingPrice)).filter((p) => !isNaN(p));

    // =======================
    // 🧠 SPECIFICATIONS
    // =======================

    let specifications: any = [];

    try {
      specifications =
        typeof product.specifications === 'string'
          ? JSON.parse(product.specifications)
          : (product.specifications ?? []);
    } catch {
      specifications = [];
    }

    // =======================
    // 🖼 PRODUCT IMAGES
    // =======================
    const s3Images =
  await this.productS3ImageResolver.resolveProductImages(product.name);

console.log("S3 Images:", s3Images);

const mainImage = s3Images.mainImage;

const gallery = s3Images.galleryImages;

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      id: product.id,

      name: product.name,

      slug: product.slug,

      type: product.type,

      status: product.status,

      currency: product.currency,

      brand: {
  id: product.brandId,
  name: brand?.name ?? '',
  slug: brand?.name ?? '',
},

      category: {
        id: product.categoryId,

        subCategoryId: product.subCategoryId,

        miniCategoryId: product.miniCategoryId,
      },

      descriptions: {
        short: product.shortDescription,

        long: product.longDescription,
      },

      price: {
        min: prices.length > 0 ? Math.min(...prices) : product.minPrice,

        max: prices.length > 0 ? Math.max(...prices) : product.maxPrice,
      },

      ratings: {
        average: product.averageRating ?? 0,

        count: product.reviewCount ?? 0,
      },

      stock: {
        quantity: safeVariants.reduce((sum, v) => sum + v.quantity, 0),

        inStock: product.status === 'ACTIVE',
      },

      isWeighted: product.isWeighted ?? false,

      isOverweight: product.isOverweight ?? false,

      weightKg:
        product.weightKg !== undefined && product.weightKg !== null
          ? Number(product.weightKg)
          : null,

      warrantyMonths: product.warrantyMonths ?? null,

      isReturnable: product.isReturnable ?? true,

      hasCatalogue: Boolean(product.hasCatalogue),

      catalogueFileName: product.catalogueFileName ?? null,

      catalogueFileUrl: product.catalogueFileUrl ?? null,

      catalogueFileType: product.catalogueFileType ?? null,

      catalogueFileSize:
        product.catalogueFileSize !== undefined && product.catalogueFileSize !== null
          ? Number(product.catalogueFileSize)
          : null,

      images: {
        main: mainImage,

        gallery,
      },

      features: product.features ?? [],

      tags: product.tags ?? [],

      displayNotes: product.displayNotes ?? [],

      specifications,

      packing: product.packing ?? [],

      directionOfUse: product.directionOfUse ?? [],

      additionalInfo: product.additionalInfo ?? [],

      faq: product.faq ?? [],

      defaultVariantId: product.defaultVariantId,

      createdAt: product.createdAt,

      updatedAt: product.updatedAt,
variants: await Promise.all(
  safeVariants.map(async (v) => {

    const s3Variant =
      await this.productS3ImageResolver.resolveVariantImages(
        product.name,
        v.name,
        s3Images,
      );

    return {
      id: v.id,

      sku: v.sku,

      name: v.name,

      slug: v.slug,

      status: v.status,

      pricing: {
        sellingPrice: v.sellingPrice,
        mrp: v.mrp,
        purchasePrice: v.purchasePrice,
      },

      stock: {
        quantity: v.quantity,
        inStock: v.status === "ACTIVE",
      },

      ratings: {
        average: v.averageRating ?? 0,
        count: v.reviewCount ?? 0,
      },

      attributes: v.attributes ?? {},

      isWeighted: v.isWeighted ?? false,

      warrantyMonths: v.warrantyMonths ?? null,

      images: {
        main: s3Variant.mainImage,
        gallery: s3Variant.galleryImages,
      },

      createdAt: v.createdAt,

      updatedAt: v.updatedAt,
    };
  }),
),
    };
  }

  // =======================
  // 📦 GET BY SLUG
  // =======================

  async executeBySlug(
    slug: string,

    onlyActive: boolean = false,
  ) {
    const product = await this.productRepo.findBySlug(slug, !onlyActive);

    if (!product) {
      throw new ProductNotFoundException({
        slug,
      });
    }

    return this.execute(product.id, onlyActive);
  }
}

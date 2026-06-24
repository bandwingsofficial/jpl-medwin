import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

import { ProductStatus } from '../../domain/enums/product-status.enum';

@Injectable()
export class GetProductDetailUseCase {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
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

    const [variants, productImages] = await Promise.all([
      this.variantRepo.findByProduct(product.id, !onlyActive),

      this.imageRepo.findByProduct(product.id, !onlyActive),
    ]);

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

    const safeImages = productImages
      .filter((img) => !!img.url)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    const mainImage = safeImages.find((i) => i.type === 'MAIN')?.url ?? null;

    const gallery = safeImages.filter((i) => i.type === 'GALLERY').map((i) => i.url);

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
    min:
      prices.length > 0
        ? Math.min(...prices)
        : product.minPrice,

    max:
      prices.length > 0
        ? Math.max(...prices)
        : product.maxPrice,
  },

  ratings: {
    average: product.averageRating ?? 0,

    count: product.reviewCount ?? 0,
  },

  stock: {
    quantity: safeVariants.reduce(
      (sum, v) => sum + v.quantity,
      0,
    ),

    inStock: safeVariants.some(
      (v) => v.quantity > 0,
    ),
  },

  isWeighted: product.isWeighted ?? false,

  warrantyMonths: product.warrantyMonths ?? null,

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

  variants: safeVariants.map((v) => {
    const imgs = (
      variantImagesMap.get(v.id) ?? []
    ).sort(
      (a, b) => a.sortOrder - b.sortOrder,
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

        inStock: v.quantity > 0,
      },

      ratings: {
        average: v.averageRating ?? 0,

        count: v.reviewCount ?? 0,
      },

      attributes: v.attributes ?? {},

      isWeighted: v.isWeighted ?? false,

      warrantyMonths: v.warrantyMonths ?? null,

      images: {
        main:
          imgs.find(
            (i) => i.type === 'MAIN',
          )?.url ?? null,

        gallery: imgs
          .filter(
            (i) => i.type === 'GALLERY',
          )
          .map((i) => i.url),
      },

      createdAt: v.createdAt,

      updatedAt: v.updatedAt,
    };
  }),
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

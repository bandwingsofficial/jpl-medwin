import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { VariantRepository } from '../../domain/repositories/variant.repository';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductImageRepository } from '../../domain/repositories/product-image.repository';

import { ProductStatus } from '../../domain/enums/product-status.enum';

type GetVariantsInput = {
  productId: string;

  search?: string;

  onlyActive?: boolean;

  includeDeleted?: boolean;

  page?: number;

  limit?: number;
};

@Injectable()
export class GetVariantsUseCase {
  constructor(
    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
  ) {}

  async execute(input: GetVariantsInput) {
    // =======================
    // 🔍 VALIDATE PRODUCT
    // =======================

    const product = await this.productRepo.findById(input.productId, true);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // =======================
    // 📄 PAGINATION
    // =======================

    const page = Number(input.page) || 1;

    const limit = Math.min(Number(input.limit) || 20, 100);

    // =======================
    // 📦 LOAD VARIANTS
    // =======================

    const variants = await this.variantRepo.findByProduct(
      input.productId,

      input.includeDeleted ?? false,
    );

    // =======================
    // 🔍 SEARCH
    // =======================

    const search = input.search?.trim()?.toLowerCase();

    let filtered = variants.filter((v) => {
      // =======================
      // ✅ ACTIVE FILTER
      // =======================

      if (input.onlyActive === true && v.status !== ProductStatus.ACTIVE) {
        return false;
      }

      // =======================
      // 🔍 SEARCH
      // =======================

      if (search) {
        const match = v.name.toLowerCase().includes(search) || v.sku.toLowerCase().includes(search);

        if (!match) {
          return false;
        }
      }

      return true;
    });

    // =======================
    // 🔽 SORT
    // =======================

    filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // =======================
    // 📄 PAGINATE
    // =======================

    const total = filtered.length;

    const start = (page - 1) * limit;

    const paginated = filtered.slice(start, start + limit);

    // =======================
    // 🖼 LOAD IMAGES
    // =======================

    const images = await this.imageRepo.findByVariantIds(
      paginated.map((v) => v.id),
      true,
    );

    // =======================
    // 🧠 GROUP IMAGES
    // =======================

    const imageMap = new Map<string, any[]>();

    for (const img of images) {
      if (!img.variantId) continue;

      if (!imageMap.has(img.variantId)) {
        imageMap.set(img.variantId, []);
      }

      imageMap.get(img.variantId)?.push(img);
    }

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
variants: paginated.map((variant) => {
        const imgs = imageMap.get(variant.id) ?? [];

        return {
          id: variant.id,

          productId: variant.productId,

          sku: variant.sku,

          name: variant.name,

          slug: variant.slug,

          status: variant.status,

          deletedAt: variant.deletedAt,

          pricing: {
            sellingPrice: variant.sellingPrice,

            mrp: variant.mrp,

            purchasePrice: variant.purchasePrice,
          },

          stock: {
            quantity: variant.quantity,

            inStock: variant.quantity > 0,
          },

          ratings: {
            average: variant.averageRating ?? 0,

            count: variant.reviewCount ?? 0,
          },

          attributes: variant.attributes ?? {},

          isWeighted: variant.isWeighted ?? false,

          warrantyMonths: variant.warrantyMonths ?? null,

          images: {
            main: imgs.find((i) => i.type === 'MAIN')?.url ?? null,

            gallery: imgs.filter((i) => i.type === 'GALLERY').map((i) => i.url),
          },

          createdAt: variant.createdAt,

          updatedAt: variant.updatedAt,
        };
      }),

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

import { Injectable, Inject } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';

import { ProductSlugService } from '../services/product-slug.service';
import { UpdateProductBuilderService } from '../services/update-product-builder.service';
import { ProductGalleryService } from '../services/product-gallery.service';
import { VariantSyncService } from '../services/variant-sync.service';
import { ProductPriceService } from '../services/product-price.service';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    private readonly productSlugService: ProductSlugService,

    private readonly updateProductBuilderService: UpdateProductBuilderService,

    private readonly productGalleryService: ProductGalleryService,

    private readonly variantSyncService: VariantSyncService,

    private readonly productPriceService: ProductPriceService,
  ) {}

  async execute(input: any) {
    const product = await this.productRepo.findById(input.id, true);

    if (!product) {
      throw new ProductNotFoundException({
        productId: input.id,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      // =======================
      // 🔥 SLUG
      // =======================

      let newSlug: string | undefined;

      if (input.slug) {
        newSlug = await this.productSlugService.generateUpdatedProductSlug(
          input.slug,
          product.id,
          tx,
        );
      } else if (input.name) {
        newSlug = await this.productSlugService.generateUpdatedProductSlug(
          input.name,
          product.id,
          tx,
        );
      }

      // =======================
      // 🧱 APPLY UPDATE
      // =======================

     const productChanged =
  this.updateProductBuilderService.update(
    product,
    input,
    newSlug,
  );

if (productChanged) {
  await this.productRepo.update(
    product,
    tx,
  );
}

      // =======================
      // 🖼 PRODUCT IMAGES
      // =======================

      await this.productGalleryService.sync(product, input, tx);

      // =======================
      // 🔄 VARIANTS
      // =======================

      await this.variantSyncService.sync(product, input.variants, tx);

      // =======================
      // 💰 PRICE RANGE
      // =======================

      const activeVariants = await this.variantSyncService.getActiveVariants(product.id, tx);

      this.productPriceService.calculatePriceRange(product, activeVariants);

      await this.productRepo.update(product, tx);

      const updated = await this.productRepo.findFullById(product.id, tx);

      if (!updated) {
        throw new ProductNotFoundException({
          productId: product.id,
        });
      }

      return updated;
    });
  }
}

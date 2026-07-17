import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductValidationService } from '../services/product-validation.service';
import { ProductSlugService } from '../services/product-slug.service';
import { ProductBuilderService } from '../services/product-builder.service';
import { ProductImageService } from '../services/product-image.service';
import { VariantCreatorService } from '../services/variant-creator.service';
import { ProductPriceService } from '../services/product-price.service';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    private readonly validationService: ProductValidationService,

    private readonly slugService: ProductSlugService,

    private readonly productBuilderService: ProductBuilderService,

    private readonly productImageService: ProductImageService,

    private readonly variantCreatorService: VariantCreatorService,

    private readonly productPriceService: ProductPriceService,
  ) {}

  async execute(input: any) {
    // =======================
    // 🔥 VALIDATION
    // =======================

    await this.validationService.validate(input);

    console.log('CreateProduct input mainImage:', input.mainImage);

    // =======================
    // 🔥 SLUG
    // =======================

    const slug = await this.slugService.generateProductSlug(input.slug || input.name);

    // =======================
    // 💾 TRANSACTION
    // =======================

    return this.prisma.$transaction(async (tx) => {
      // =======================
      // 🆕 CREATE / RESTORE PRODUCT
      // =======================

      const product = await this.productBuilderService.build(input, slug, tx);

      // =======================
      // 🖼 PRODUCT IMAGES
      // =======================

      await this.productImageService.createProductImages(product, input, tx);

      // =======================
      // ➕ VARIANTS
      // =======================

      product.defaultVariantId = await this.variantCreatorService.createVariants(
        product,
        input.variants,
        tx,
      );

      // =======================
      // 💰 PRICE RANGE
      // =======================

      this.productPriceService.calculatePriceRange(product, input.variants);

      // =======================
      // 💾 SAVE PRODUCT
      // =======================

      await this.productRepo.update(product, tx);

      // =======================
      // 🔥 FINAL FETCH
      // =======================

      const fullProduct = await this.productRepo.findFullById(product.id, tx);

      if (!fullProduct) {
        throw new Error('Product created but failed to fetch');
      }

      return fullProduct;
    });
  }
}

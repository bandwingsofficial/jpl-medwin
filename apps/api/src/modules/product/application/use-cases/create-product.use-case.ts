import { Inject, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { TOKENS } from '@/common/constants/tokens';
import { BaseException } from '@/common/exceptions/base.exception';
import { ErrorCode } from '@/common/constants/error-codes';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { ProductValidationService } from '../services/product-validation.service';
import { ProductSlugService } from '../services/product-slug.service';
import { ProductBuilderService } from '../services/product-builder.service';
import { ProductImageService } from '../services/product-image.service';
import { VariantCreatorService } from '../services/variant-creator.service';
import { ProductPriceService } from '../services/product-price.service';
import { ProductCreateValidator } from '../services/product-create.validator';
import { ProductCreateLogger } from '../services/product-create.logger';
import { ProductSkuService } from '../services/product-sku.service';

import { ProductType } from '../../domain/enums/product-type.enum';
import { CustomerType } from '../../domain/enums/customer-type.enum';

@Injectable()
export class CreateProductUseCase {
  private readonly logger = new ProductCreateLogger();

  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    private readonly validationService: ProductValidationService,

    private readonly createValidator: ProductCreateValidator,

    private readonly slugService: ProductSlugService,

    private readonly productBuilderService: ProductBuilderService,

    private readonly productImageService: ProductImageService,

    private readonly variantCreatorService: VariantCreatorService,

    private readonly productPriceService: ProductPriceService,

    private readonly skuService: ProductSkuService,
  ) {}

  async execute(input: any) {
    let currentStep = 'DTO received';

    try {
      currentStep = 'Input validation';

      this.logger.step('DTO parsed', JSON.stringify({
        name: input.name,
        type: input.type,
        customerType: input.customerType,
        brandId: input.brandId,
        categoryId: input.categoryId,
        subCategoryId: input.subCategoryId,
        miniCategoryId: input.miniCategoryId,
        variantCount: input.variants?.length ?? 0,
      }));

      this.createValidator.validate(input);

      this.logger.step('Validation passed');

      currentStep = 'Relation validation';

      await this.validationService.validate(input);

      this.logger.step('Brand and category relations verified');

      const productType = input.type ?? ProductType.VARIABLE;

      let variants = Array.isArray(input.variants) ? input.variants : [];

      if (productType === ProductType.SIMPLE) {
        const baseVariant = variants[0] ?? {};

        variants = [
          {
            ...baseVariant,
            name: input.name,
            isDeleted: false,
          },
        ];
      }

      currentStep = 'SKU context validation';

      await this.skuService.validateSkuContext({
  brandId: input.brandId,
  customerType:
    (input.customerType as CustomerType) ?? CustomerType.DOCTOR,
  productType,
});

      this.logger.step('SKU context validated');

      currentStep = 'Slug generation';

      const slug = await this.slugService.generateProductSlug(input.slug || input.name);

      this.logger.step('Slug generated', slug);

      return await this.prisma.$transaction(async (tx) => {
        currentStep = 'Product insert';

        const product = await this.productBuilderService.build(input, slug, tx);

        this.logger.step('Product created', product.id);

        currentStep = 'Product image insert';

        await this.productImageService.createProductImages(product, input, tx);

        this.logger.step('Product images linked');

        currentStep = 'Variant insert';

        product.defaultVariantId = await this.variantCreatorService.createVariants(
          product,
          variants,
          tx,
        );

        this.logger.step('Variants created');

        this.productPriceService.calculatePriceRange(product, variants);

        await this.productRepo.update(product, tx);

        currentStep = 'Product fetch';

        const fullProduct = await this.productRepo.findFullById(product.id, tx);

        if (!fullProduct) {
          throw new BaseException(
            'Product created but failed to fetch',
            ErrorCode.PRODUCT.INVALID,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        this.logger.step('Commit successful', product.id);

        return fullProduct;
      });
    } catch (error) {
      this.logger.failure(currentStep, error);
      throw error;
    }
  }
}

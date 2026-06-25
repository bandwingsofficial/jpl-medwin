import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { Product } from '../../domain/entities/product.entity';

import { ProductType } from '../../domain/enums/product-type.enum';

@Injectable()
export class ProductBuilderService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,
  ) {}

  async build(
    input: any,

    slug: string,

    tx?: any,
  ): Promise<Product> {
    // =======================
    // ♻️ RESTORE DELETED PRODUCT
    // =======================

    const existingDeletedProduct = await this.productRepo.findBySlug(slug, true, tx);

    if (existingDeletedProduct?.isDeleted()) {
      existingDeletedProduct.restore();

      existingDeletedProduct.updateDetails({
        shortDescription: input.shortDescription,

        longDescription: input.longDescription,

        features: input.features ?? [],

        tags: input.tags ?? [],

        displayNotes: input.displayNotes ?? [],

        specifications: input.specifications ?? [],

        packing: input.packing ?? [],

        directionOfUse: input.directionOfUse ?? [],

        additionalInfo: input.additionalInfo ?? [],

        faq: input.faq ?? [],

        isWeighted: input.isWeighted,

        warrantyMonths: input.warrantyMonths,
      });

      return this.productRepo.update(existingDeletedProduct, tx);
    }

    // =======================
    // 🆕 CREATE PRODUCT
    // =======================

    const product = new Product(
      crypto.randomUUID(),

      input.name,

      slug,

      input.type ?? ProductType.VARIABLE,

      input.categoryId,

      input.subCategoryId,

      input.miniCategoryId,

      input.brandId,
    );

    product.updateDetails({
      shortDescription: input.shortDescription,

      longDescription: input.longDescription,

      features: input.features ?? [],

      tags: input.tags ?? [],

      displayNotes: input.displayNotes ?? [],

      specifications: input.specifications ?? [],

      packing: input.packing ?? [],

      directionOfUse: input.directionOfUse ?? [],

      additionalInfo: input.additionalInfo ?? [],

      faq: input.faq ?? [],

      isWeighted: input.isWeighted,

      warrantyMonths: input.warrantyMonths,
    });

    await this.productRepo.create(product, tx);

    return product;
  }
}

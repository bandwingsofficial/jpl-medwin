import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ProductRepository } from '../../domain/repositories/product.repository';

import { Product } from '../../domain/entities/product.entity';

import { ProductType } from '../../domain/enums/product-type.enum';
import { CustomerType } from '../../domain/enums/customer-type.enum';

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

        hsnCode: input.hsnCode ?? null,

        customerType: input.customerType ?? CustomerType.DOCTOR,

        features: input.features ?? [],

        tags: input.tags ?? [],

        displayNotes: input.displayNotes ?? [],

        specifications: input.specifications ?? [],

        packing: input.packing ?? [],

        directionOfUse: input.directionOfUse ?? [],

        additionalInfo: input.additionalInfo ?? [],

        faq: input.faq ?? [],

        isWeighted: input.isWeighted,

        isOverweight: input.isOverweight,

        weightKg: input.weightKg,

        warrantyMonths: input.warrantyMonths,

        hasCatalogue: input.hasCatalogue,

        catalogueFileName: input.catalogueFileName,

        catalogueFileUrl: input.catalogueFileUrl,

        catalogueFileType: input.catalogueFileType,

        catalogueFileSize: input.catalogueFileSize,
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

      input.customerType ?? CustomerType.DOCTOR,

      input.hsnCode ?? null,

      input.categoryId,

      input.subCategoryId,

      input.miniCategoryId ?? null,

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

      isOverweight: input.isOverweight,

      weightKg: input.weightKg,

      warrantyMonths: input.warrantyMonths,

      hasCatalogue: input.hasCatalogue,

      catalogueFileName: input.catalogueFileName,

      catalogueFileUrl: input.catalogueFileUrl,

      catalogueFileType: input.catalogueFileType,

      catalogueFileSize: input.catalogueFileSize,
    });

    await this.productRepo.create(product, tx);

    return product;
  }
}

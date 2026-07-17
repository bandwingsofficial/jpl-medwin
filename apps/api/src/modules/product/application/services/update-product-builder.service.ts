// src/modules/product/application/services/update-product-builder.service.ts

import { Injectable } from '@nestjs/common';

import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class UpdateProductBuilderService {
  update(product: Product, input: any, newSlug?: string): boolean {
    let changed = false;

    // =======================
    // BASIC FIELDS
    // =======================

    if (input.name !== undefined && product.name !== input.name) {
      product.name = input.name;
      changed = true;
    }

    if (newSlug && product.slug !== newSlug) {
      product.slug = newSlug;
      changed = true;
    }

    // =======================
    // DETAILS
    // =======================

    const oldValues = {
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      features: product.features,
      tags: product.tags,
      displayNotes: product.displayNotes,
      specifications: product.specifications,
      packing: product.packing,
      directionOfUse: product.directionOfUse,
      additionalInfo: product.additionalInfo,
      faq: product.faq,
      isWeighted: product.isWeighted,
      warrantyMonths: product.warrantyMonths,
    };

    const newValues = {
      shortDescription: input.shortDescription,
      longDescription: input.longDescription,
      features: input.features,
      tags: input.tags,
      displayNotes: input.displayNotes,
      specifications: input.specifications,
      packing: input.packing,
      directionOfUse: input.directionOfUse,
      additionalInfo: input.additionalInfo,
      faq: input.faq,
      isWeighted: input.isWeighted,
      warrantyMonths: input.warrantyMonths,
    };

    if (JSON.stringify(oldValues) !== JSON.stringify(newValues)) {
      product.updateDetails(newValues);
      changed = true;
    }

    return changed;
  }
}

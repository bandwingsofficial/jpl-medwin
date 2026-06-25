// src/modules/product/application/services/product-export-flattener.service.ts

import { Injectable } from '@nestjs/common';

import { ParsedProduct } from '../types/product-import.types';

@Injectable()
export class ProductExportFlattenerService {
  flatten(products: ParsedProduct[]): any[] {
    const rows: any[] = [];

    for (const product of products) {
      for (const variant of product.variants) {
        rows.push({
          Group_name: product.name,

          Category: product.category,

          Sub_category: product.subCategory,

          'Mini Catory': product.miniCategory,

          Brand: product.brand,

          Description: product.shortDescription ?? product.longDescription ?? '',

          Features: product.features?.filter(Boolean).join('\n') ?? '',

          Tags: product.tags?.filter(Boolean).join(', ') ?? '',

          'Display note': product.displayNotes?.filter(Boolean).join('\n') ?? '',

          'Key Specification':
            product.specifications?.map((spec) => `${spec.key}: ${spec.value}`).join('\n') ?? '',

          Packing: product.packing?.filter(Boolean).join('\n') ?? '',

          'Direction Of Use': product.directionOfUse?.filter(Boolean).join('\n') ?? '',

          'Additional Info': product.additionalInfo?.filter(Boolean).join('\n') ?? '',

          FAQ: product.faq?.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n') ?? '',

          Image: variant.images.main ?? product.images.main ?? '',

          'Gallery Images': [...(variant.images.gallery ?? [])].join('\n'),

          SKU: variant.sku,

          Variant_name: variant.name,

          'Purchase Price': variant.purchasePrice,

          'Selling Price': variant.sellingPrice,

          MRP: variant.mrp,

          Quantity: variant.quantity,

          Color: variant.attributes?.color ?? '',

          Size: variant.attributes?.size ?? '',

          Storage: variant.attributes?.storage ?? '',

          'Average Rating': variant.averageRating,

          'Review Count': variant.reviewCount,

          'Weighted product': variant.isWeighted,

          Warranty: variant.warrantyMonths,
        });
      }
    }
    return rows;
  }
}

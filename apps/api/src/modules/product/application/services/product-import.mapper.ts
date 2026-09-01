// src/modules/product/application/services/product-import-mapper.service.ts

import { Injectable } from '@nestjs/common';

import { ExcelParserHelper } from '../utils/excel-parser.helper';

import { ParsedProduct, ParsedVariant } from '../types/product-import.types';

@Injectable()
export class ProductImportMapperService {
  map(rows: any[]): ParsedProduct[] {
    const grouped = new Map<string, ParsedProduct>();
console.log('ROWS RECEIVED BY MAPPER:', rows.length);
    for (const row of rows) {
      if (
  String(
    ExcelParserHelper.getValue(
      row,
      'group_name',
      'product_name',
    ),
  ).includes('Cheek')
) {
  console.log('FOUND CHEEK PRODUCT:', row);
}

      console.log(Object.keys(row));

      console.log('==========================');
console.log('HEADERS:', Object.keys(row));
console.log('ROW:', row);

console.log(
  'Customer Type:',
  ExcelParserHelper.getValue(row, 'customer_type'),
);

console.log(
  'Variant:',
  ExcelParserHelper.getValue(row, 'variant_name'),
);

console.log(
  'Selling Price:',
  ExcelParserHelper.getValue(row, 'selling_price'),
);
      // =======================
      // PRODUCT NAME
      // =======================

     const productName = ExcelParserHelper.normalizeText(
      
  ExcelParserHelper.getValue(
    row,
    'group_name',
    'groupname',
    'product_name',
  ),
);
console.log('Product Name:', productName);

console.log({
  sku: ExcelParserHelper.getValue(row, 'sku'),
  variant: ExcelParserHelper.getValue(row, 'variant_name'),
  customerType: ExcelParserHelper.getValue(row, 'customer_type'),
  sellingPrice: ExcelParserHelper.getValue(row, 'selling_price'),
  purchasePrice: ExcelParserHelper.getValue(row, 'purchase_price'),
  mrp: ExcelParserHelper.getValue(row, 'mrp'),
  quantity: ExcelParserHelper.getValue(row, 'quantity'),
  productType: ExcelParserHelper.getValue(row, 'product_type'),
});
      if (!productName) {
        continue;
      }

      // =======================
      // CREATE PRODUCT
      // =======================

      if (!grouped.has(productName)) {
        grouped.set(productName, {
          name: productName,

          category: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(row, 'category'),
),
         subCategory: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(
    row,
    'sub_category',
    'subcategory',
  ),
),
          miniCategory: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(
    row,
    'mini_catory',
    'mini_category',
    'minicategory',
  ),
),
          brand: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(row, 'brand'),
),
      customerType:
  ExcelParserHelper.normalizeText(
    ExcelParserHelper.getValue(row, 'customer_type'),
  ) || 'CUSTOMER',
          hsnCode: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(
    row,
    'zoho_hsn',
    'hsn_code',
    'hsn',
  ),
),
        type: 'SIMPLE',

         shortDescription: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(row, 'description'),
),
          longDescription: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(row, 'description'),
),
          features: ExcelParserHelper.parseBulletList(ExcelParserHelper.getValue(row, 'features')),

          tags: ExcelParserHelper.parseTags(ExcelParserHelper.getValue(row, 'tags')),

          displayNotes: ExcelParserHelper.parseBulletList(ExcelParserHelper.getValue(row, 'display_notes')),

          specifications: ExcelParserHelper.parseSpecifications(ExcelParserHelper.getValue(row, 'key_specification')),

          packing: ExcelParserHelper.parseBulletList(ExcelParserHelper.getValue(row, 'packing')),

          directionOfUse: ExcelParserHelper.parseBulletList(ExcelParserHelper.getValue(row, 'direction_of_use')),

          additionalInfo: ExcelParserHelper.parseBulletList(ExcelParserHelper.getValue(row, 'additional_info')),

          faq: ExcelParserHelper.parseFaq(ExcelParserHelper.getValue(row, 'faq')),

          images: {
            main: ExcelParserHelper.parseImages(ExcelParserHelper.getValue(
    row,
    'image',
))[0] ?? null,

            gallery: ExcelParserHelper.parseImages(ExcelParserHelper.getValue(row, 'gallery_images')),
          },

          variants: [],
        });
      }

      const product = grouped.get(productName)!;
      
      const excelProductType = ExcelParserHelper
  .normalizeText(
    ExcelParserHelper.getValue(row, 'product_type'),
  )
  .toUpperCase();

if (
  excelProductType === 'VARIABLE' ||
  excelProductType === 'VARIANT'
) {
  product.type = 'VARIABLE';
} else {
  product.type = 'SIMPLE';
}

      // =======================
      // ATTRIBUTES
      // =======================

      const attributes: Record<string, string> = {};

      if (ExcelParserHelper.getValue(row,'color')) {
        attributes.color = ExcelParserHelper.normalizeText(ExcelParserHelper.getValue(row, 'color'));
      }

      if (ExcelParserHelper.getValue(row,'size')) {
        attributes.size = ExcelParserHelper.normalizeText(ExcelParserHelper.getValue(row, 'size'));
      }

      if (ExcelParserHelper.getValue(row,'storage')) {
        attributes.storage = ExcelParserHelper.normalizeText(ExcelParserHelper.getValue(row, 'storage'));
      }

      // =======================
      // VARIANT
      // =======================

      const variant: ParsedVariant = {
        sku: ExcelParserHelper.normalizeText(
  ExcelParserHelper.getValue(
    row,
    'sku',
  ),
),
      name:
  ExcelParserHelper.normalizeText(
    ExcelParserHelper.getValue(row, 'variant_name'),
  ) || productName,


        purchasePrice: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(row, 'purchase_price')) ?? 0,

        sellingPrice: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(row, 'selling_price')) ?? 0,

        mrp: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(
    row,
    'mrp',
)) ?? 0,

        quantity: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(
    row,
    'quantity',
)) ?? 0,

        attributes,

        averageRating: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(
    row,
    'average_rating',
)) ?? 0,

        reviewCount: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(row, 'review_count')) ?? 0,

        isWeighted: ExcelParserHelper.parseBoolean(ExcelParserHelper.getValue(row, 'weighted_product')),

        warrantyMonths: ExcelParserHelper.parseNumber(ExcelParserHelper.getValue(row, 'warranty')) ?? null,

        images: {
          main: ExcelParserHelper.parseImages(ExcelParserHelper.getValue(row, 'image'))[0] ?? null,

          gallery: ExcelParserHelper.parseImages(ExcelParserHelper.getValue(row, 'gallery_images')),
        },
      };
      
     console.log('====================');
console.log({
  product: productName,
  sku: variant.sku,
  sellingPrice: variant.sellingPrice,
  mrp: variant.mrp,
  excelRow: row,
});

product.variants.push(variant);
      if (productName === 'Denmax Bur Box Aluminium') {
  console.log('========== MAPPER ==========');
  console.log({
    product: productName,
    sku: variant.sku,
    purchasePrice: variant.purchasePrice,
    sellingPrice: variant.sellingPrice,
    mrp: variant.mrp,
  });
}
    }

    // =======================
    // AUTO TYPE
    // =======================

    for (const product of grouped.values()) {
     if (
  product.type !== 'VARIABLE' &&
  product.type !== 'SIMPLE'
) {
  product.type =
    product.variants.length > 1
      ? 'VARIABLE'
      : 'SIMPLE';
}
      console.log('Mapped DTO:', product.name);
      console.log('Mapped mainImage:', product.images.main);

      if (product.images.main) {
        console.log('Mapped mainImage source: Excel Image column');
      }
    }

    return [...grouped.values()];
  }
}

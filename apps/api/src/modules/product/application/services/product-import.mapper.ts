// src/modules/product/application/services/product-import-mapper.service.ts

import { Injectable } from '@nestjs/common';

import { ExcelParserHelper } from '../utils/excel-parser.helper';

import { ParsedProduct, ParsedVariant } from '../types/product-import.types';

@Injectable()
export class ProductImportMapperService {
  map(rows: any[]): ParsedProduct[] {
    const grouped = new Map<string, ParsedProduct>();

    for (const row of rows) {
      // =======================
      // PRODUCT NAME
      // =======================

      const productName = ExcelParserHelper.normalizeText(row['Group_name']);

      if (!productName) {
        continue;
      }

      // =======================
      // CREATE PRODUCT
      // =======================

      if (!grouped.has(productName)) {
        grouped.set(productName, {
          name: productName,

          category: ExcelParserHelper.normalizeText(row['Category']),

          subCategory: ExcelParserHelper.normalizeText(row['Sub_category']),

          miniCategory: ExcelParserHelper.normalizeText(row['Mini Catory']),

          brand: ExcelParserHelper.normalizeText(row['Brand']),

          type: 'SIMPLE',

          shortDescription: ExcelParserHelper.normalizeText(row['Description']),

          longDescription: ExcelParserHelper.normalizeText(row['Description']),

          features: ExcelParserHelper.parseBulletList(row['Features']),

          tags: ExcelParserHelper.parseTags(row['Tags']),

          displayNotes: ExcelParserHelper.parseBulletList(row['Display note']),

          specifications: ExcelParserHelper.parseSpecifications(row['Key Specification']),

          packing: ExcelParserHelper.parseBulletList(row['Packing']),

          directionOfUse: ExcelParserHelper.parseBulletList(row['Direction Of Use']),

          additionalInfo: ExcelParserHelper.parseBulletList(row['Additional Info']),

          faq: ExcelParserHelper.parseFaq(row['FAQ']),

          images: {
            main: ExcelParserHelper.parseImages(row['Image'])[0] ?? null,

            gallery: ExcelParserHelper.parseImages(row['Gallery Images']),
          },

          variants: [],
        });
      }

      const product = grouped.get(productName)!;

      // =======================
      // ATTRIBUTES
      // =======================

      const attributes: Record<string, string> = {};

      if (row['Color']) {
        attributes.color = ExcelParserHelper.normalizeText(row['Color']);
      }

      if (row['Size']) {
        attributes.size = ExcelParserHelper.normalizeText(row['Size']);
      }

      if (row['Storage']) {
        attributes.storage = ExcelParserHelper.normalizeText(row['Storage']);
      }

      // =======================
      // SKU
      // =======================

      const sku = ExcelParserHelper.normalizeText(row['SKU']).split('\n').pop()?.trim() ?? '';

      // =======================
      // VARIANT
      // =======================

      const variant: ParsedVariant = {
        sku,

        name: ExcelParserHelper.normalizeText(row['Variant_name']),

        purchasePrice: ExcelParserHelper.parseNumber(row['Purchase Price']) ?? 0,

        sellingPrice: ExcelParserHelper.parseNumber(row['Selling Price']) ?? 0,

        mrp: ExcelParserHelper.parseNumber(row['MRP']) ?? 0,

        quantity: ExcelParserHelper.parseNumber(row['Quantity']) ?? 0,

        attributes,

        averageRating: ExcelParserHelper.parseNumber(row['Average Rating']) ?? 0,

        reviewCount: ExcelParserHelper.parseNumber(row['Review Count']) ?? 0,

        isWeighted: ExcelParserHelper.parseBoolean(row['Weighted product']),

        warrantyMonths: ExcelParserHelper.parseNumber(row['Warranty']) ?? null,

        images: {
          main: ExcelParserHelper.parseImages(row['Image'])[0] ?? null,

          gallery: ExcelParserHelper.parseImages(row['Gallery Images']),
        },
      };

      product.variants.push(variant);
    }

    // =======================
    // AUTO TYPE
    // =======================

    for (const product of grouped.values()) {
      product.type = product.variants.length > 1 ? 'VARIABLE' : 'SIMPLE';

      console.log('Mapped DTO:', product.name);
      console.log('Mapped mainImage:', product.images.main);

      if (product.images.main) {
        console.log('Mapped mainImage source: Excel Image column');
      }
    }

    return [...grouped.values()];
  }
}

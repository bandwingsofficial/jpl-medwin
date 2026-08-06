import { Injectable } from '@nestjs/common';

import {
  ParsedProduct,
  ParsedVariant,
  ProductImportValidationError,
} from '../types/product-import.types';


@Injectable()
export class ProductImportValidatorService {
  // =======================
  // ✅ VALIDATE
  // =======================

  validate(products: ParsedProduct[]) {
    const errors: ProductImportValidationError[] = [];

    const productNames = new Set<string>();

    products.forEach((product, index) => {
      const row = index + 1;

      // =======================
      // PRODUCT NAME
      // =======================

      if (!product.name) {
        errors.push({
          row,
          reason: 'Product name is required',
        });
      }

      // =======================
      // DUPLICATE PRODUCT
      // =======================

      const normalizedName = product.name.trim().toLowerCase();

      if (productNames.has(normalizedName)) {
        errors.push({
          row,
          product: product.name,
          reason: 'Duplicate product found in Excel',
        });
      }

      productNames.add(normalizedName);
      // =======================
      // VARIANTS
      // =======================

      if (!product.variants.length) {
        errors.push({
          row,
          product: product.name,
          reason: 'Product must contain at least one variant',
        });

        return;
      }

      // =======================
      // VARIANT LOOP
      // =======================

      product.variants.forEach((variant: ParsedVariant, variantIndex) => {
        this.validateVariant(variant, variantIndex, row, product.name, errors);
      });
    });

    return {
      valid: errors.length === 0,

      totalErrors: errors.length,

      errors,
    };
  }

  // =======================
  // VARIANT VALIDATION
  // =======================

  private validateVariant(
    variant: ParsedVariant,
    variantIndex: number,
    row: number,
    productName: string,
    errors: ProductImportValidationError[],
  ) {
   if (productName === 'Denmax Bur Box Aluminium') {
  console.log('========== VALIDATOR ==========');
  console.log({
    product: productName,
    sku: variant.sku,
    purchasePrice: variant.purchasePrice,
    sellingPrice: variant.sellingPrice,
    mrp: variant.mrp,
  });
}
    // VARIANT NAME

   if (!variant.name && productName !== variant.sku) {
      errors.push({
        row,
        product: productName,
        sku: variant.sku,
        reason: 'Variant name is required',
      });
    }

    // PURCHASE PRICE

    if (variant.purchasePrice < 0) {
      errors.push({
        row,
        product: productName,
        sku: variant.sku,
        reason: 'Purchase price cannot be negative',
      });
    }

    // SELLING PRICE

    // MRP

    // PRICE CHECK

    // STOCK

    if (variant.quantity < 0) {
      errors.push({
        row,
        product: productName,
        sku: variant.sku,
        reason: 'Quantity cannot be negative',
      });
    }

    // MAIN IMAGE

    if (variant.images.main && !this.isValidUrl(variant.images.main)) {
      errors.push({
        row,
        product: productName,
        sku: variant.sku,
        reason: 'Invalid main image URL',
      });
    }

    // GALLERY IMAGES

    for (const image of variant.images.gallery) {
      if (!this.isValidUrl(image)) {
        errors.push({
          row,
          product: productName,
          sku: variant.sku,
          reason: `Invalid gallery image URL (${image})`,
        });
      }
    }

    // WARRANTY

    if (variant.warrantyMonths !== null && variant.warrantyMonths < 0) {
      errors.push({
        row,
        product: productName,
        sku: variant.sku,
        reason: 'Warranty cannot be negative',
      });
    }
  }

  // =======================
  // URL VALIDATION
  // =======================

  private isValidUrl(value: string): boolean {
    try {
      new URL(value);

      return true;
    } catch {
      return false;
    }
  }
}

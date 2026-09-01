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
  // =========================
  // VARIANT NAME
  // =========================

  if (!variant.name && productName !== variant.sku) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'Variant name is required',
    });
  }

  // =========================
  // PURCHASE PRICE
  // =========================

  if (
    variant.purchasePrice !== undefined &&
    variant.purchasePrice < 0
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'Purchase price cannot be negative',
    });
  }

  // =========================
  // SELLING PRICE
  // =========================

  if (
    variant.sellingPrice !== undefined &&
    variant.sellingPrice < 0
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'Selling price cannot be negative',
    });
  }

  // =========================
  // MRP
  // =========================

  if (
    variant.mrp !== undefined &&
    variant.mrp < 0
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'MRP cannot be negative',
    });
  }

  // =========================
  // PRICE CHECK
  // =========================

  // Only compare when BOTH values are provided.
  // Blank Selling Price is allowed.
  // Blank Purchase Price is allowed.

  if (
    variant.purchasePrice !== undefined &&
    variant.sellingPrice !== undefined &&
    variant.purchasePrice > 0 &&
    variant.sellingPrice > 0 &&
    variant.sellingPrice < variant.purchasePrice
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason:
        'Selling Price must be greater than or equal to Purchase Price',
    });
  }

  // =========================
  // SELLING PRICE vs MRP
  // =========================

  // Only compare when BOTH values are provided.

  if (
    variant.sellingPrice !== undefined &&
    variant.mrp !== undefined &&
    variant.mrp > 0 &&
    variant.sellingPrice > variant.mrp
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'Selling Price cannot exceed MRP',
    });
  }

  // =========================
  // STOCK
  // =========================

  if (
    variant.quantity !== undefined &&
    variant.quantity < 0
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'Quantity cannot be negative',
    });
  }

  // =========================
  // MAIN IMAGE
  // =========================

  if (
    variant.images.main &&
    !this.isValidUrl(variant.images.main)
  ) {
    errors.push({
      row,
      product: productName,
      sku: variant.sku,
      reason: 'Invalid main image URL',
    });
  }

  // =========================
  // GALLERY IMAGES
  // =========================

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

  // =========================
  // WARRANTY
  // =========================

  if (
    variant.warrantyMonths !== null &&
    variant.warrantyMonths !== undefined &&
    variant.warrantyMonths < 0
  ) {
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

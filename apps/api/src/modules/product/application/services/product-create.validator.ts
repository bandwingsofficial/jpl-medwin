import { Injectable } from '@nestjs/common';

import {
  ValidationFailedException,
  ValidationFieldError,
} from '@/common/exceptions/validation-failed.exception';

import { CustomerType, parseCustomerType } from '../../domain/enums/customer-type.enum';
import { ProductType } from '../../domain/enums/product-type.enum';

@Injectable()
export class ProductCreateValidator {
  validate(input: {
    name?: string;
    type?: ProductType;
    customerType?: CustomerType | string;
    categoryId?: string;
    subCategoryId?: string;
    miniCategoryId?: string | null;
    brandId?: string;
    hsnCode?: string | null;
    mainImage?: string;
    variants?: any[];
  }): void {
    const errors: ValidationFieldError[] = [];

    if (!input.name?.trim()) {
      errors.push({ field: 'name', message: 'Product name is required.' });
    }

    if (!input.customerType) {
      errors.push({
        field: 'customerType',
        message: 'Customer Type is required.',
      });
    } else if (!parseCustomerType(String(input.customerType))) {
      errors.push({
        field: 'customerType',
        message: 'Customer Type must be Doctor or Hospital.',
      });
    }

    if (!input.brandId?.trim()) {
      errors.push({ field: 'brandId', message: 'Brand is required.' });
    }

    if (!input.categoryId?.trim()) {
      errors.push({ field: 'categoryId', message: 'Category is required.' });
    }

    if (!input.subCategoryId?.trim()) {
      errors.push({ field: 'subCategoryId', message: 'Sub Category is required.' });
    }

    if (!input.type) {
      errors.push({ field: 'type', message: 'Product Type is required.' });
    }

    if (input.hsnCode?.trim()) {
      const hsn = input.hsnCode.trim();

      if (!/^[0-9]{4,8}$/.test(hsn)) {
        errors.push({
          field: 'hsnCode',
          message: 'HSN Code must be 4-8 digits.',
        });
      }
    }

    const productType = input.type ?? ProductType.VARIABLE;
    const variants = this.resolveVariants(input, productType);

    if (productType === ProductType.VARIABLE) {
      const activeVariants = variants.filter((variant) => !variant?.isDeleted);

      if (!activeVariants.length) {
        errors.push({
          field: 'variants',
          message: 'At least one variant is required.',
        });
      }

      activeVariants.forEach((variant, index) => {
        this.validateVariant(variant, index + 1, errors, {
          nameRequired: true,
        });
      });
    } else if (productType === ProductType.SIMPLE) {
      const baseVariant = variants[0] ?? {};

      this.validateVariant(baseVariant, 1, errors, {
        nameRequired: false,
      });
    }

    if (errors.length) {
      throw new ValidationFailedException('Validation failed', errors);
    }
  }

  private resolveVariants(input: any, productType: ProductType) {
    const variants = Array.isArray(input.variants) ? input.variants : [];

    if (productType === ProductType.SIMPLE) {
      const baseVariant = variants[0] ?? {};

      return [
        {
          ...baseVariant,
          name: input.name,
          isDeleted: false,
        },
      ];
    }

    return variants;
  }

  private getVariantLabel(variant: any, variantNumber: number): string {
    const name = variant?.name?.trim();

    if (name) {
      return `Variant "${name}"`;
    }

    return `Variant ${variantNumber}`;
  }

  private validateVariant(
    variant: any,
    variantNumber: number,
    errors: ValidationFieldError[],
    options?: { nameRequired?: boolean },
  ) {
    const prefix = `variants[${variantNumber - 1}]`;
    const label = this.getVariantLabel(variant, variantNumber);
    const nameRequired = options?.nameRequired ?? true;

    if (nameRequired && !variant?.name?.trim()) {
      errors.push({
        field: `${prefix}.name`,
        message: `${label}: Variant Name is required.`,
      });
    }

    const sellingPrice = variant?.sellingPrice;

    if (
      sellingPrice === undefined ||
      sellingPrice === null ||
      sellingPrice === '' ||
      Number.isNaN(Number(sellingPrice)) ||
      Number(sellingPrice) <= 0
    ) {
      errors.push({
        field: `${prefix}.sellingPrice`,
        message: `${label}: Selling Price is required.`,
      });
    }

    const purchasePrice = variant?.purchasePrice;

    if (
      purchasePrice !== undefined &&
      purchasePrice !== null &&
      purchasePrice !== '' &&
      Number(purchasePrice) < 0
    ) {
      errors.push({
        field: `${prefix}.purchasePrice`,
        message: `${label}: Purchase Price cannot be negative.`,
      });
    }

    const mrp = variant?.mrp;

    if (mrp !== undefined && mrp !== null && mrp !== '' && Number(mrp) < 0) {
      errors.push({
        field: `${prefix}.mrp`,
        message: `${label}: MRP cannot be negative.`,
      });
    }

    if (
      sellingPrice !== undefined &&
      sellingPrice !== null &&
      sellingPrice !== '' &&
      mrp !== undefined &&
      mrp !== null &&
      mrp !== '' &&
      Number(mrp) > 0 &&
      Number(sellingPrice) > Number(mrp)
    ) {
      errors.push({
        field: `${prefix}.sellingPrice`,
        message: `${label}: Selling Price cannot exceed MRP.`,
      });
    }

    if (
      purchasePrice !== undefined &&
      purchasePrice !== null &&
      purchasePrice !== '' &&
      Number(purchasePrice) > 0 &&
      sellingPrice !== undefined &&
      sellingPrice !== null &&
      sellingPrice !== '' &&
      Number(sellingPrice) < Number(purchasePrice)
    ) {
      errors.push({
        field: `${prefix}.sellingPrice`,
        message: `${label}: Selling Price must be greater than or equal to Purchase Price.`,
      });
    }

    const quantity = variant?.quantity;

    if (
      quantity !== undefined &&
      quantity !== null &&
      quantity !== '' &&
      Number(quantity) < 0
    ) {
      errors.push({
        field: `${prefix}.quantity`,
        message: `${label}: Quantity cannot be negative.`,
      });
    }
  }
}

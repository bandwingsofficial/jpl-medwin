import { Injectable } from '@nestjs/common';

import { Product } from '../../domain/entities/product.entity';
import { ProductType } from '../../domain/enums/product-type.enum';

@Injectable()
export class UpdateProductBuilderService {
  update(product: Product, input: any, newSlug?: string): boolean {
    let changed = false;

    if (input.name !== undefined && product.name !== input.name) {
      product.name = input.name;
      changed = true;
    }

    if (newSlug && product.slug !== newSlug) {
      product.slug = newSlug;
      changed = true;
    }

    if (input.type !== undefined && product.type !== input.type) {
      product.type = input.type;
      changed = true;
    }

    if (
      input.customerType !== undefined &&
      product.customerType !== input.customerType
    ) {
      product.customerType = input.customerType;
      changed = true;
    }

    if (input.categoryId !== undefined && product.categoryId !== input.categoryId) {
      product.categoryId = input.categoryId;
      changed = true;
    }

    if (input.subCategoryId !== undefined && product.subCategoryId !== input.subCategoryId) {
      product.subCategoryId = input.subCategoryId;
      changed = true;
    }

    if (input.miniCategoryId !== undefined && product.miniCategoryId !== input.miniCategoryId) {
      product.miniCategoryId = input.miniCategoryId || null;
      changed = true;
    }

    if (input.brandId !== undefined && product.brandId !== input.brandId) {
      product.brandId = input.brandId;
      changed = true;
    }

    if (input.hsnCode !== undefined && product.hsnCode !== (input.hsnCode?.trim() || null)) {
      product.hsnCode = input.hsnCode?.trim() ? input.hsnCode.trim() : null;
      changed = true;
    }

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

export function normalizeVariantsForProductType(params: {
  product: Product;
  input: any;
  existingVariants: VariantLike[];
}): any[] {
  const { product, input, existingVariants } = params;
  const productType = input.type ?? product.type;
  const productName = input.name ?? product.name;

  if (productType === ProductType.SIMPLE) {
    const incoming = Array.isArray(input.variants) ? input.variants : [];
    const keeper =
      incoming.find((variant) => variant.id === product.defaultVariantId) ||
      incoming[0] ||
      existingVariants.find((variant) => variant.id === product.defaultVariantId) ||
      existingVariants[0];

    const base = keeper ? { ...keeper } : {};

    return [
      {
        ...base,
        name: productName,
        isDeleted: false,
      },
    ];
  }

  const incoming = Array.isArray(input.variants) ? input.variants : [];

  if (incoming.length > 0) {
    return incoming;
  }

  if (existingVariants.length > 0) {
    return existingVariants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      purchasePrice: variant.purchasePrice,
      sellingPrice: variant.sellingPrice,
      mrp: variant.mrp,
      quantity: variant.quantity,
      attributes: variant.attributes,
      averageRating: variant.averageRating,
      reviewCount: variant.reviewCount,
      isWeighted: variant.isWeighted,
      warrantyMonths: variant.warrantyMonths,
      priorityOrder: variant.priorityOrder,
      sku: variant.sku,
      isDeleted: false,
    }));
  }

  return [
    {
      name: '',
      purchasePrice: 0,
      sellingPrice: 0,
      mrp: 0,
      quantity: 0,
      attributes: {},
      isDeleted: false,
    },
  ];
}

interface VariantLike {
  id: string;
  name: string;
  sku: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  quantity: number;
  attributes?: Record<string, any>;
  averageRating?: number;
  reviewCount?: number;
  isWeighted?: boolean;
  warrantyMonths?: number | null;
  priorityOrder?: number;
}

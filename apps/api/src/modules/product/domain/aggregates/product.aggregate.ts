import { Product } from '../entities/product.entity';
import { Variant } from '../entities/variant.entity';

import { VariantNotFoundException } from '../exceptions/variant-not-found.exception';
import { VariantSkuExistsException } from '../exceptions/variant-sku-exists.exception';

export class ProductAggregate {
  constructor(
    public readonly product: Product,
    private variants: Variant[] = [],
  ) {}

  // =======================
  // 📦 GETTERS
  // =======================

  getVariants(): Variant[] {
    return this.variants.filter((v) => !v.isDeleted());
  }

  getAllVariants(): Variant[] {
    return this.variants;
  }

  getVariantById(variantId: string): Variant {
    const variant = this.variants.find((v) => v.id === variantId && !v.isDeleted());

    if (!variant) {
      throw new VariantNotFoundException({ variantId });
    }

    return variant;
  }

  // =======================
  // ➕ ADD VARIANT
  // =======================

  addVariant(variant: Variant): void {
    this.ensureSameProduct(variant);
    this.ensureUniqueSku(variant.sku);

    this.variants.push(variant);
  }

  // =======================
  // ✏️ UPDATE VARIANT
  // =======================

  updateVariant(updated: Variant): void {
    const existing = this.getVariantById(updated.id);

    this.ensureUniqueSku(updated.sku, updated.id);

    existing.updateDetails({
      name: updated.name,
      slug: updated.slug,
      quantity: updated.quantity,
      purchasePrice: updated.purchasePrice,
      sellingPrice: updated.sellingPrice,
      mrp: updated.mrp,
      attributes: updated.attributes,
    });
  }

  // =======================
  // ❌ REMOVE VARIANT
  // =======================

  removeVariant(variantId: string): void {
    const variant = this.getVariantById(variantId);
    variant.softDelete();
  }

  // =======================
  // 🔄 SYNC VARIANTS
  // =======================

  syncVariants(incoming: Variant[]) {
    const existingMap = new Map(this.variants.map((v) => [v.id, v]));

    const result = {
      toCreate: [] as Variant[],
      toUpdate: [] as Variant[],
      toDelete: [] as Variant[],
    };

    for (const incomingVariant of incoming) {
      this.ensureSameProduct(incomingVariant);

      if (!incomingVariant.id || !existingMap.has(incomingVariant.id)) {
        this.addVariant(incomingVariant);
        result.toCreate.push(incomingVariant);
      } else {
        const existing = existingMap.get(incomingVariant.id)!;

        if (existing.isDeleted()) {
          existing.restore();
        }

        this.updateVariant(incomingVariant);
        result.toUpdate.push(existing);
      }
    }

    const incomingIds = new Set(incoming.map((v) => v.id));

    for (const existing of this.variants) {
      if (!incomingIds.has(existing.id) && !existing.isDeleted()) {
        existing.softDelete();
        result.toDelete.push(existing);
      }
    }

    return result;
  }

  // =======================
  // 📦 STOCK
  // =======================

  reduceStock(variantId: string, qty: number): void {
    const variant = this.getVariantById(variantId);

    if (!variant.isActive()) {
      throw new Error('Variant inactive');
    }

    variant.reduceStock(qty);
  }

  // =======================
  // ⭐ PRODUCT LOGIC
  // =======================

  updateRating(rating: number): void {
    this.product.updateRating(rating);
  }

  // =======================
  // 🔐 INTERNAL
  // =======================

  private ensureSameProduct(variant: Variant) {
    if (variant.productId !== this.product.id) {
      throw new Error('Variant does not belong to this product');
    }
  }

  private ensureUniqueSku(sku: string, ignoreId?: string) {
    const exists = this.variants.some((v) => v.sku === sku && v.id !== ignoreId && !v.isDeleted());

    if (exists) {
      throw new VariantSkuExistsException({ sku });
    }
  }
}

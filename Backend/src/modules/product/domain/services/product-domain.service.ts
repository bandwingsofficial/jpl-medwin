import { Injectable, Inject } from '@nestjs/common';
import { TOKENS } from '@/common/constants/tokens';
import { Prisma } from '@prisma/client';

import { ProductRepository } from '../repositories/product.repository';
import { VariantRepository } from '../repositories/variant.repository';
import { ProductImageRepository } from '../repositories/product-image.repository';

import { Product } from '../entities/product.entity';
import { Variant } from '../entities/variant.entity';

import { ProductSlugExistsException } from '../exceptions/product-slug-exists.exception';
import { VariantSkuExistsException } from '../exceptions/variant-sku-exists.exception';
import { VariantOutOfStockException } from '../exceptions/variant-out-of-stock.exception';

@Injectable()
export class ProductDomainService {
  constructor(
    @Inject(TOKENS.PRODUCT_REPO)
    private readonly productRepo: ProductRepository,

    @Inject(TOKENS.VARIANT_REPO)
    private readonly variantRepo: VariantRepository,

    @Inject(TOKENS.PRODUCT_IMAGE_REPO)
    private readonly imageRepo: ProductImageRepository,
  ) {}

  // =======================
  // 🔒 PRODUCT SLUG
  // =======================

  async validateProductSlug(slug: string): Promise<void> {
    const exists = await this.productRepo.existsBySlug(slug, true);

    if (exists) {
      throw new ProductSlugExistsException({ slug });
    }
  }

  async validateProductSlugForUpdate(slug: string, productId: string): Promise<void> {
    const existing = await this.productRepo.findBySlug(slug, true);

    if (existing && existing.id !== productId) {
      throw new ProductSlugExistsException({ slug });
    }
  }

  // =======================
  // 🔒 VARIANT SKU
  // =======================

  async validateVariantSku(sku: string): Promise<void> {
    const exists = await this.variantRepo.existsBySku(sku, true);

    if (exists) {
      throw new VariantSkuExistsException({ sku });
    }
  }

  async validateVariantSkuForUpdate(sku: string, variantId: string): Promise<void> {
    const existing = await this.variantRepo.findBySku(sku, true);

    if (existing && existing.id !== variantId) {
      throw new VariantSkuExistsException({ sku });
    }
  }

  // =======================
  // 🛡 PRODUCT STATUS
  // =======================

  validateProductActive(product: Product): void {
    product.ensureActive();
  }

  // =======================
  // 🛡 VARIANT STATUS
  // =======================

  validateVariantActive(variant: Variant): void {
    if (!variant.isActive()) {
      throw new Error(`Variant ${variant.id} is inactive`);
    }
  }

  // =======================
  // 📦 STOCK
  // =======================

  validateStock(variant: Variant, qty: number): void {
    if (variant.quantity < qty) {
      throw new VariantOutOfStockException({
        variantId: variant.id,
        available: variant.quantity,
        requested: qty,
      });
    }
  }

  // =======================
  // 🔍 PRODUCT USAGE
  // =======================

  async getProductUsageInfo(productId: string) {
    const variants = await this.variantRepo.findByProduct(productId);
    const images = await this.imageRepo.findByProduct(productId);

    return {
      variantCount: variants.length,
      imageCount: images.length,
      hasUsage: variants.length > 0 || images.length > 0,
    };
  }

  // =======================
  // 🔍 VARIANT USAGE
  // =======================

  async getVariantUsageInfo(variantId: string) {
    const images = await this.imageRepo.findByVariant(variantId);

    return {
      imageCount: images.length,
      hasUsage: images.length > 0,
    };
  }

  // =======================
  // 🔥 DELETE PRODUCT TREE
  // =======================

  async deleteProductTree(productId: string, tx?: Prisma.TransactionClient): Promise<void> {
    // 1️⃣ delete variant images
    const variants = await this.variantRepo.findByProduct(productId, false, tx);

    for (const variant of variants) {
      await this.imageRepo.softDeleteByVariant(variant.id, tx);
    }

    // 2️⃣ delete product images
    await this.imageRepo.softDeleteByProduct(productId, tx);

    // 3️⃣ delete variants
    await this.variantRepo.softDeleteByProduct(productId, tx);

    // 4️⃣ delete product
    await this.productRepo.softDelete(productId, tx);
  }

  // =======================
  // 🔥 DELETE VARIANT TREE
  // =======================

  async deleteVariantTree(variantId: string, tx?: Prisma.TransactionClient): Promise<void> {
    await this.imageRepo.softDeleteByVariant(variantId, tx);
    await this.variantRepo.softDelete(variantId, tx);
  }

  // =======================
  // 🔒 DELETE VALIDATION
  // =======================

  async validateVariantDeletion(variantId: string): Promise<void> {
    const info = await this.getVariantUsageInfo(variantId);

    if (info.hasUsage) {
      throw new Error('Variant has dependencies. Use force delete.');
    }
  }
}

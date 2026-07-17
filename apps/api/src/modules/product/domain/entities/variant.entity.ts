import { ProductStatus } from '../enums/product-status.enum';
import { VariantOutOfStockException } from '../exceptions/variant-out-of-stock.exception';

export class Variant {
  constructor(
    public readonly id: string,

    // 🔗 Relation
    public productId: string,

    // 🆔 Identity
    public sku: string,
    public name: string,
    public slug: string,

    // 💰 Pricing
    public purchasePrice: number,
    public sellingPrice: number,
    public mrp: number,

    // 📦 Inventory
    public quantity: number = 0,

    // ⚙️ Attributes
    public attributes?: Record<string, any>,

    // ⭐ Reviews
    public averageRating: number = 0,
    public reviewCount: number = 0,

    // ⚖️ Extra
    public isWeighted: boolean = false,
    public warrantyMonths: number | null = null,

    // 📊 Status
    public status: ProductStatus = ProductStatus.ACTIVE,

    // 🕒 Time
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {
    if (!sku?.trim()) {
      throw new Error('SKU is required');
    }

    if (!name?.trim()) {
      throw new Error('Variant name is required');
    }

    if (!slug?.trim()) {
      throw new Error('Variant slug is required');
    }

    this.validatePricing();
  }

  // ================= STATE =================

  isActive(): boolean {
    return this.status === ProductStatus.ACTIVE && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  isInStock(): boolean {
    return this.quantity > 0;
  }

  ensureActive() {
    if (!this.isActive()) {
      throw new Error(`Variant ${this.id} is inactive`);
    }
  }

  activate() {
    if (this.isDeleted()) return;

    this.status = ProductStatus.ACTIVE;

    this.touch();
  }

  deactivate() {
    this.status = ProductStatus.INACTIVE;

    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) return;

    this.deletedAt = new Date();

    this.status = ProductStatus.INACTIVE;

    this.touch();
  }

  restore() {
    if (!this.isDeleted()) return;

    this.deletedAt = undefined;

    this.status = ProductStatus.ACTIVE;

    this.touch();
  }

  // ================= UPDATE =================

  updateDetails(data: {
    name?: string;
    slug?: string;

    purchasePrice?: number;
    sellingPrice?: number;
    mrp?: number;

    quantity?: number;

    attributes?: Record<string, any>;

    averageRating?: number;
    reviewCount?: number;

    isWeighted?: boolean;

    warrantyMonths?: number | null;
  }) {
    if (this.isDeleted()) {
      throw new Error('Cannot update deleted variant');
    }

    // ================= NAME =================

    if (data.name !== undefined) {
      if (!data.name.trim()) {
        throw new Error('Invalid name');
      }

      this.name = data.name;
    }

    // ================= SLUG =================

    if (data.slug !== undefined) {
      if (!data.slug.trim()) {
        throw new Error('Invalid slug');
      }

      this.slug = data.slug;
    }

    // ================= PRICING =================

    if (data.purchasePrice !== undefined) {
      this.purchasePrice = data.purchasePrice;
    }

    if (data.sellingPrice !== undefined) {
      this.sellingPrice = data.sellingPrice;
    }

    if (data.mrp !== undefined) {
      this.mrp = data.mrp;
    }

    this.validatePricing();

    // ================= QUANTITY =================

    if (data.quantity !== undefined) {
      if (data.quantity < 0) {
        throw new Error('Quantity cannot be negative');
      }

      this.quantity = data.quantity;
    }

    // ================= ATTRIBUTES =================

    if (data.attributes !== undefined) {
      this.attributes = data.attributes;
    }

    // ================= REVIEWS =================

    if (data.averageRating !== undefined) {
      this.averageRating = data.averageRating;
    }

    if (data.reviewCount !== undefined) {
      this.reviewCount = data.reviewCount;
    }

    // ================= EXTRA =================

    if (data.isWeighted !== undefined) {
      this.isWeighted = data.isWeighted;
    }

    if (data.warrantyMonths !== undefined) {
      this.warrantyMonths = data.warrantyMonths;
    }

    this.touch();
  }

  // ================= STOCK =================

  updateStock(quantity: number) {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    this.quantity = quantity;

    this.touch();
  }

  reduceStock(qty: number) {
    if (qty <= 0) return;

    if (this.quantity < qty) {
      throw new VariantOutOfStockException({
        variantId: this.id,
      });
    }

    this.quantity -= qty;

    this.touch();
  }

  // ================= PRICING =================

  getDiscountPercentage(): number {
    if (this.mrp <= 0) return 0;

    return Math.round(((this.mrp - this.sellingPrice) / this.mrp) * 100);
  }

  private validatePricing() {
    if (this.purchasePrice < 0 || this.sellingPrice < 0 || this.mrp < 0) {
      throw new Error('Price cannot be negative');
    }

    if (this.sellingPrice > this.mrp) {
      throw new Error('Selling price cannot exceed MRP');
    }
  }

  // ================= RATING =================

  updateRating(newRating: number) {
    if (newRating < 0 || newRating > 5) {
      throw new Error('Invalid rating');
    }

    this.reviewCount += 1;

    this.averageRating =
      (this.averageRating * (this.reviewCount - 1) + newRating) / this.reviewCount;

    this.touch();
  }

  // ================= INTERNAL =================

  private touch() {
    this.updatedAt = new Date();
  }
}

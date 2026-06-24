import { ProductStatus } from '../enums/product-status.enum';
import { ProductType } from '../enums/product-type.enum';
import { ProductInactiveException } from '../exceptions/product-inactive.exception';

type Specification = { key: string; value: string };
type FAQ = { question: string; answer: string };

export class Product {
  constructor(
    public readonly id: string,

    // 🧾 Basic
    public name: string,
    public slug: string,
    public type: ProductType,

    // 🔗 Relations
    public categoryId: string,
    public subCategoryId: string,
    public miniCategoryId: string,
    public brandId: string,

    // ⭐ Variant
    public defaultVariantId?: string,

    // 📖 Content
    public shortDescription?: string,
    public longDescription?: string,

    public features: string[] = [],
    public tags: string[] = [],
    public displayNotes: string[] = [],

    public specifications?: Specification[],
    public packing?: string[],
    public directionOfUse?: string[],
    public additionalInfo?: string[],
    public faq?: FAQ[],

    // 💰 Pricing
    public minPrice?: number,
    public maxPrice?: number,
    public currency: string = 'INR',

    // ⭐ Reviews
    public averageRating: number = 0,
    public reviewCount: number = 0,

    // ⚙️ Meta
    public isWeighted: boolean = false,
    public warrantyMonths?: number,

    // 📊 Status
    public status: ProductStatus = ProductStatus.ACTIVE,

    // 🕒 Time
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {
    if (!name?.trim()) throw new Error('Product name is required');
    if (!slug?.trim()) throw new Error('Product slug is required');
  }

  // ================= STATE =================

  isActive(): boolean {
    return this.status === ProductStatus.ACTIVE && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
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
    this.status = ProductStatus.ACTIVE; // 🔥 FIX (important)
    this.touch();
  }

  // ================= UPDATE =================

  updateDetails(params: {
    name?: string;
    slug?: string;
    type?: ProductType;

    categoryId?: string;
    subCategoryId?: string;
    miniCategoryId?: string;
    brandId?: string;

    defaultVariantId?: string;

    shortDescription?: string;
    longDescription?: string;

    features?: string[];
    tags?: string[];
    displayNotes?: string[];

    specifications?: Specification[];
    packing?: string[];
    directionOfUse?: string[];
    additionalInfo?: string[];
    faq?: FAQ[];

    isWeighted?: boolean;
    warrantyMonths?: number;
  }) {
    if (this.isDeleted()) {
      throw new Error('Cannot update deleted product');
    }

    if (params.name !== undefined) {
      if (!params.name.trim()) throw new Error('Invalid name');
      this.name = params.name;
    }

    if (params.slug !== undefined) {
      if (!params.slug.trim()) throw new Error('Invalid slug');
      this.slug = params.slug;
    }

    if (params.type !== undefined) this.type = params.type;

    if (params.categoryId !== undefined) this.categoryId = params.categoryId;
    if (params.subCategoryId !== undefined) this.subCategoryId = params.subCategoryId;
    if (params.miniCategoryId !== undefined) this.miniCategoryId = params.miniCategoryId;
    if (params.brandId !== undefined) this.brandId = params.brandId;

    if (params.defaultVariantId !== undefined) {
      this.defaultVariantId = params.defaultVariantId;
    }

    if (params.shortDescription !== undefined) this.shortDescription = params.shortDescription;

    if (params.longDescription !== undefined) this.longDescription = params.longDescription;

    if (params.features !== undefined) this.features = params.features;

    if (params.tags !== undefined) this.tags = params.tags;

    if (params.displayNotes !== undefined) this.displayNotes = params.displayNotes;

    if (params.specifications !== undefined) this.specifications = params.specifications;

    if (params.packing !== undefined) this.packing = params.packing;

    if (params.directionOfUse !== undefined) this.directionOfUse = params.directionOfUse;

    if (params.additionalInfo !== undefined) this.additionalInfo = params.additionalInfo;

    if (params.faq !== undefined) this.faq = params.faq;

    if (params.isWeighted !== undefined) this.isWeighted = params.isWeighted;

    if (params.warrantyMonths !== undefined) this.warrantyMonths = params.warrantyMonths;

    this.touch();
  }

  // ================= PRICE =================

  updatePriceRange(min: number, max: number) {
    if (min < 0 || max < 0) throw new Error('Invalid price');
    if (min > max) throw new Error('Min > Max');

    this.minPrice = min;
    this.maxPrice = max;

    this.touch();
  }

  // ================= RATING =================

  updateRating(newRating: number) {
    if (newRating < 0 || newRating > 5) {
      throw new Error('Invalid rating');
    }

    this.reviewCount += 1;

    this.averageRating =
      (this.averageRating * (this.reviewCount - 1) + newRating) / this.reviewCount;
  }

  // ================= GUARD =================

  ensureActive() {
    if (!this.isActive()) {
      throw new ProductInactiveException({ productId: this.id });
    }
  }

  // ================= INTERNAL =================

  private touch() {
    this.updatedAt = new Date();
  }
}

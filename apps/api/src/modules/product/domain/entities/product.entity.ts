import { ProductStatus } from '../enums/product-status.enum';
import { ProductType } from '../enums/product-type.enum';
import { CustomerType } from '../enums/customer-type.enum';
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
    public customerType: CustomerType,
    public hsnCode: string | null = null,

    // 🔗 Relations
    public categoryId: string,
    public subCategoryId: string,
    public miniCategoryId: string | null,
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
    public isOverweight: boolean = false,
    public weightKg?: number | null,
    public warrantyMonths?: number,
    public isReturnable: boolean = true,

    // 📄 Catalogue / Attachment
    public hasCatalogue: boolean = false,
    public catalogueFileName?: string | null,
    public catalogueFileUrl?: string | null,
    public catalogueFileType?: string | null,
    public catalogueFileSize?: number | null,

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
    customerType?: CustomerType;
    hsnCode?: string | null;

    categoryId?: string;
    subCategoryId?: string;
    miniCategoryId?: string | null;
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
    isOverweight?: boolean;
    weightKg?: number | null;
    warrantyMonths?: number;
    isReturnable?: boolean;

    hasCatalogue?: boolean;
    catalogueFileName?: string | null;
    catalogueFileUrl?: string | null;
    catalogueFileType?: string | null;
    catalogueFileSize?: number | null;
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

    if (params.customerType !== undefined) this.customerType = params.customerType;

    if (params.hsnCode !== undefined) {
      this.hsnCode = params.hsnCode?.trim() ? params.hsnCode.trim() : null;
    }

    if (params.categoryId !== undefined) this.categoryId = params.categoryId;
    if (params.subCategoryId !== undefined) this.subCategoryId = params.subCategoryId;
    if (params.miniCategoryId !== undefined) {
      this.miniCategoryId = params.miniCategoryId;
    }
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

    if (params.isOverweight !== undefined) this.isOverweight = params.isOverweight;

    if (params.weightKg !== undefined) this.weightKg = params.weightKg;

    if (params.warrantyMonths !== undefined) this.warrantyMonths = params.warrantyMonths;
    if (params.isReturnable !== undefined) this.isReturnable = params.isReturnable;

    if (params.hasCatalogue !== undefined) this.hasCatalogue = params.hasCatalogue;

    if (params.catalogueFileName !== undefined) this.catalogueFileName = params.catalogueFileName;

    if (params.catalogueFileUrl !== undefined) this.catalogueFileUrl = params.catalogueFileUrl;

    if (params.catalogueFileType !== undefined) this.catalogueFileType = params.catalogueFileType;

    if (params.catalogueFileSize !== undefined) this.catalogueFileSize = params.catalogueFileSize;

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

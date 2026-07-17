import { ImageOwnerType } from '../enums/image-owner-type.enum';
import { ImageType } from '../enums/image-type.enum';
import { InvalidProductImageOwnerException } from '../exceptions/invalid-product-image-owner.exception';

export class ProductImage {
  constructor(
    public readonly id: string,

    public url: string,

    public type: ImageType,
    public ownerType: ImageOwnerType,

    public productId?: string,
    public variantId?: string,

    public alt?: string,
    public sortOrder: number = 0,

    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {
    if (!url?.trim()) throw new Error('Image URL is required');

    this.validateOwner();

    if (sortOrder < 0) {
      throw new Error('Sort order cannot be negative');
    }
  }

  // ================= STATE =================

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  isMain(): boolean {
    return this.type === ImageType.MAIN;
  }

  isGallery(): boolean {
    return this.type === ImageType.GALLERY;
  }

  // ================= VALIDATION =================

  private validateOwner() {
    const hasProduct = !!this.productId;
    const hasVariant = !!this.variantId;

    // must belong to exactly one
    if (hasProduct === hasVariant) {
      throw new InvalidProductImageOwnerException({
        ownerType: this.ownerType,
      });
    }

    // match owner type
    if (this.ownerType === ImageOwnerType.PRODUCT && !hasProduct) {
      throw new InvalidProductImageOwnerException({
        ownerType: this.ownerType,
      });
    }

    if (this.ownerType === ImageOwnerType.VARIANT && !hasVariant) {
      throw new InvalidProductImageOwnerException({
        ownerType: this.ownerType,
      });
    }
  }

  // ================= UPDATE =================

  updateDetails(params: { alt?: string; sortOrder?: number; type?: ImageType }) {
    if (this.isDeleted()) {
      throw new Error('Cannot update deleted image');
    }

    if (params.alt !== undefined) {
      this.alt = params.alt;
    }

    if (params.sortOrder !== undefined) {
      if (params.sortOrder < 0) {
        throw new Error('Sort order cannot be negative');
      }
      this.sortOrder = params.sortOrder;
    }

    if (params.type !== undefined) {
      this.type = params.type;
    }

    this.touch();
  }

  // ================= BUSINESS =================

  markAsMain() {
    if (this.isDeleted()) {
      throw new Error('Cannot update deleted image');
    }

    this.type = ImageType.MAIN;
    this.touch();
  }

  markAsGallery() {
    if (this.isDeleted()) {
      throw new Error('Cannot update deleted image');
    }

    this.type = ImageType.GALLERY;
    this.touch();
  }

  updateSortOrder(order: number) {
    if (order < 0) {
      throw new Error('Sort order cannot be negative');
    }

    this.sortOrder = order;
    this.touch();
  }

  updateAltText(alt: string) {
    this.alt = alt;
    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) return;

    this.deletedAt = new Date();
    this.touch();
  }

  restore() {
    if (!this.isDeleted()) return;

    this.deletedAt = undefined;
    this.touch();
  }

  // ================= INTERNAL =================

  private touch() {
    this.updatedAt = new Date();
  }
}

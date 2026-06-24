import { BannerStatus } from '../enums/banner-status.enum';

export class BannerImage {
  constructor(
    public readonly id: string,

    public bannerId: string,

    public imageUrl: string,

    public productId?: string,

    public sortOrder: number = 0,

    // =======================
    // 📦 STATUS
    // =======================

    public status: BannerStatus = BannerStatus.ACTIVE,

    // =======================
    // 🕒 TIMESTAMPS
    // =======================

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),

    // =======================
    // ♻️ DELETE
    // =======================

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return (
      this.status === BannerStatus.ACTIVE &&
      !this.deletedAt
    );
  }

  isInactive(): boolean {
    return (
      this.status === BannerStatus.INACTIVE
    );
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  activate() {
    this.status = BannerStatus.ACTIVE;

    this.touch();
  }

  deactivate() {
    this.status = BannerStatus.INACTIVE;

    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) {
      return;
    }

    this.deactivate();

    this.deletedAt = new Date();

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.activate();

    this.touch();
  }

  updateImage(imageUrl: string) {
    this.imageUrl = imageUrl;

    this.touch();
  }

  updateProduct(productId?: string) {
    this.productId = productId;

    this.touch();
  }

  updateSortOrder(sortOrder: number) {
    this.sortOrder = sortOrder;

    this.touch();
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}
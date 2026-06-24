import { BannerStatus } from '../enums/banner-status.enum';
import { BannerType } from '../enums/banner-type.enum';

import { BannerInactiveException } from '../exceptions/banner-inactive.exception';

export class Banner {
  constructor(
    public readonly id: string,

    // =======================
    // 📝 BASIC
    // =======================

    public name: string,

    public type: BannerType,

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
    return this.status === BannerStatus.INACTIVE;
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

  ensureActive() {
    if (!this.isActive()) {
      throw new BannerInactiveException({
        bannerId: this.id,
      });
    }
  }

  softDelete() {
    if (this.isDeleted()) {
      return;
    }

    this.deletedAt = new Date();

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.touch();
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}
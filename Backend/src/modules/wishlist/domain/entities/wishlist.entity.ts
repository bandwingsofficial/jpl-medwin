// src/modules/wishlist/domain/entities/wishlist.entity.ts

export class Wishlist {
  constructor(
    public readonly id: string,

    // =======================
    // 👤 USER
    // =======================

    public userId: string,

    // =======================
    // 📦 PRODUCT
    // =======================

    public productId: string,

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

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  isActive(): boolean {
    return !this.deletedAt;
  }

  // =======================
  // ♻️ LIFECYCLE
  // =======================

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
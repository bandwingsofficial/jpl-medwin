// src/modules/order/domain/entities/order-item.entity.ts

export class OrderItem {
  constructor(
    public readonly id: string,

    // =======================
    // 🔗 RELATION
    // =======================

    public orderId: string,

    // =======================
    // 📦 PRODUCT
    // =======================

    public productId: string,

    public variantId: string,

    // =======================
    // 📸 SNAPSHOT
    // =======================

    public productName: string,

    public variantName?: string,

    public sku?: string,

    public imageUrl?: string,

    // =======================
    // 📦 QUANTITY
    // =======================

    public quantity: number = 1,

    // =======================
    // 💰 PRICE SNAPSHOT
    // =======================

    public price: number = 0,

    public mrp?: number,

    public totalPrice: number = 0,

    public totalMrp?: number,

    public totalSavings?: number,

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

  // =======================
  // 💰 CALCULATIONS
  // =======================

  calculateSubtotal(): number {
    return this.price * this.quantity;
  }

  calculateMrpTotal(): number {
    return (this.mrp ?? this.price) * this.quantity;
  }

  calculateSavings(): number {
    return this.calculateMrpTotal() - this.calculateSubtotal();
  }

  // =======================
  // 🔄 SNAPSHOT RECALC
  // =======================

  refreshTotals() {
    this.totalPrice = this.calculateSubtotal();

    this.totalMrp = this.calculateMrpTotal();

    this.totalSavings = this.calculateSavings();

    this.touch();
  }

  // =======================
  // ♻️ DELETE
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

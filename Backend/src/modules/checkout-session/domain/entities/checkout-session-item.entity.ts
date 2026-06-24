// src/modules/checkout-session/domain/entities/checkout-session-item.entity.ts

export class CheckoutSessionItem {
  constructor(
    public readonly id: string,

    public checkoutSessionId: string,

    public productId: string,

    public variantId: string,

    public quantity: number,

    // =======================
    // 📸 SNAPSHOTS
    // =======================

    public productName: string,

    public variantName?: string,

    public sku?: string,

    public imageUrl?: string,

    // =======================
    // 💰 PRICE SNAPSHOT
    // =======================

    public price: number = 0,

    public mrp?: number,

    public totalPrice: number = 0,

    // =======================
    // 🕒 TIMESTAMPS
    // =======================

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),
  ) {}

  // =======================
  // 💰 CALCULATIONS
  // =======================

  calculateTotal(): number {
    return this.price * this.quantity;
  }

  calculateSavings(): number {
    if (!this.mrp) {
      return 0;
    }

    return (this.mrp - this.price) * this.quantity;
  }

  // =======================
  // 🔄 UPDATE
  // =======================

  updateQuantity(quantity: number) {
    if (quantity < 1) {
      quantity = 1;
    }

    this.quantity = quantity;

    this.totalPrice = this.calculateTotal();

    this.touch();
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}

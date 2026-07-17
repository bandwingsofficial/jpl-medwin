import { CategoryStatus } from '../enums/category-status.enum';
import { CategoryInactiveException } from '../exceptions/category-inactive.exception';

export class SubCategory {
  constructor(
    public readonly id: string,

    public categoryId: string,

    public name: string,
    public slug: string,

    public imageUrl?: string,

    public description?: string,
    public metaDescription?: string,

    public status: CategoryStatus = CategoryStatus.ACTIVE,

    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {}

  // =======================
  // 🌟 ENRICHMENT (OPTIONAL)
  // =======================

  // 👉 NOT part of constructor (important)
  categoryName?: string;

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return this.status === CategoryStatus.ACTIVE && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  activate() {
    this.status = CategoryStatus.ACTIVE;
  }

  deactivate() {
    this.status = CategoryStatus.INACTIVE;
  }

  softDelete() {
    this.deletedAt = new Date();
    this.status = CategoryStatus.INACTIVE;
  }

  // =======================
  // 🛡️ GUARDS
  // =======================

  ensureActive() {
    if (!this.isActive()) {
      throw new CategoryInactiveException({
        categoryId: this.categoryId,
      });
    }
  }
}

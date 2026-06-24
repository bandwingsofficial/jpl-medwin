import { BrandStatus } from '../enums/brand-status.enum';
import { BrandNotActiveException } from '../exceptions/brand-not-active.exception';

export class Brand {
  constructor(
    public readonly id: string,

    public name: string,
    public slug: string,
    public imageUrl?: string,

    public description?: string,
    public metaDescription?: string,

    public status: BrandStatus = BrandStatus.ACTIVE,

    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return this.status === BrandStatus.ACTIVE && !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  activate() {
    if (this.isDeleted()) return; // optional guard

    this.status = BrandStatus.ACTIVE;
    this.touch();
  }

  deactivate() {
    this.status = BrandStatus.INACTIVE;
    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) return;

    this.deletedAt = new Date();
    this.status = BrandStatus.INACTIVE;
    this.touch();
  }

  updateDetails(params: {
    name?: string;
    slug?: string;
    description?: string;
    metaDescription?: string;
  }) {
    if (params.name !== undefined) this.name = params.name;
    if (params.slug !== undefined) this.slug = params.slug;
    if (params.description !== undefined) this.description = params.description;
    if (params.metaDescription !== undefined) this.metaDescription = params.metaDescription;

    this.touch();
  }

  // =======================
  // 🛡️ GUARDS
  // =======================

  ensureActive() {
    if (!this.isActive()) {
      throw new BrandNotActiveException({
        brandId: this.id,
      });
    }
  }

  // =======================
  // 🕒 INTERNAL
  // =======================

  private touch() {
    this.updatedAt = new Date();
  }
}

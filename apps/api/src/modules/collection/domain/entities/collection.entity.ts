// src/modules/collection/domain/entities/collection.entity.ts

import { CollectionStatus } from '../enums/collection-status.enum';

import { CollectionInactiveException } from '../exceptions/collection-inactive.exception';

export class Collection {
  constructor(
    public readonly id: string,

    // =======================
    // 📝 BASIC
    // =======================

    public name: string,

    public slug: string,

    public imageUrl?: string,

    public description?: string,

    public metaDescription?: string,

    // =======================
    // 📦 STATUS
    // =======================

    public status: CollectionStatus = CollectionStatus.ACTIVE,

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
    return this.status === CollectionStatus.ACTIVE && !this.deletedAt;
  }

  isInactive(): boolean {
    return this.status === CollectionStatus.INACTIVE;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  activate() {
    this.status = CollectionStatus.ACTIVE;

    this.touch();
  }

  deactivate() {
    this.status = CollectionStatus.INACTIVE;

    this.touch();
  }

  ensureActive() {
    if (!this.isActive()) {
      throw new CollectionInactiveException({
        collectionId: this.id,
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

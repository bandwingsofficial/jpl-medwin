// src/modules/profile/domain/entities/profile.entity.ts

import { ProfileAlreadyDeletedException } from '../exceptions/profile-already-deleted.exception';

export class Profile {
  constructor(
    public readonly id: string,

    public readonly userId: string,

    public name?: string,
    public email?: string,
    public phoneNumber?: string,

    public avatarUrl?: string,

    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  updateDetails(params: {
    name?: string;
    email?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  }) {
    if (params.name !== undefined) {
      this.name = params.name;
    }

    if (params.email !== undefined) {
      this.email = params.email;
    }

    if (params.phoneNumber !== undefined) {
      this.phoneNumber = params.phoneNumber;
    }

    if (params.avatarUrl !== undefined) {
      this.avatarUrl = params.avatarUrl;
    }

    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) {
      throw new ProfileAlreadyDeletedException({
        profileId: this.id,
      });
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
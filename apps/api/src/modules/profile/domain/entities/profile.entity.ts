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

    public salutation?: string,
    public firstName?: string,
    public lastName?: string,
    public customerType?: string,
    public clinicHospitalName?: string,
    public whatsappNumber?: string,
    public gstNumber?: string,
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
    salutation?: string;
    firstName?: string;
    lastName?: string;
    customerType?: string;
    clinicHospitalName?: string;
    whatsappNumber?: string;
    gstNumber?: string;
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

    if (params.salutation !== undefined) {
      this.salutation = params.salutation;
    }

    if (params.firstName !== undefined) {
      this.firstName = params.firstName;
    }

    if (params.lastName !== undefined) {
      this.lastName = params.lastName;
    }

    if (params.customerType !== undefined) {
      this.customerType = params.customerType;
    }

    if (params.clinicHospitalName !== undefined) {
      this.clinicHospitalName = params.clinicHospitalName;
    }

    if (params.whatsappNumber !== undefined) {
      this.whatsappNumber = params.whatsappNumber;
    }

    if (params.gstNumber !== undefined) {
      this.gstNumber = params.gstNumber;
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

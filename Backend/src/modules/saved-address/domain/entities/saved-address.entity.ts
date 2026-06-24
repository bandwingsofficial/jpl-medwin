// src/modules/saved-address/domain/entities/saved-address.entity.ts

import { AddressType } from '../enums/address-type.enum';

import { AddressNotActiveException } from '../exceptions/address-not-active.exception';

import { AddressAlreadyDeletedException } from '../exceptions/address-already-deleted.exception';

import { InvalidAddressException } from '../exceptions/invalid-address.exception';

export class SavedAddress {
  constructor(
    public readonly id: string,

    public readonly userId: string,

    public fullName: string | undefined,

    public phoneNumber: string,

    // =======================
    // 🏷 TYPE
    // =======================

    public type: AddressType,

    // =======================
    // 📍 REQUIRED ADDRESS
    // =======================

    public addressLine1: string,

    public city: string,

    public state: string,

    public country: string,

    public postalCode: string,

    // =======================
    // 📍 OPTIONAL ADDRESS
    // =======================

    public alias?: string,

    public addressLine2?: string,

    public landmark?: string,

    // =======================
    // 🌍 GEO
    // =======================

    public latitude?: number,

    public longitude?: number,

    // =======================
    // 🚚 FLAGS
    // =======================

    public isDefault: boolean = false,

    public readonly createdAt: Date = new Date(),

    public updatedAt: Date = new Date(),

    public deletedAt?: Date,
  ) {}

  // =======================
  // 🧠 STATE
  // =======================

  isActive(): boolean {
    return !this.deletedAt;
  }

  isDeleted(): boolean {
    return !!this.deletedAt;
  }

  isHome(): boolean {
    return this.type === AddressType.HOME;
  }

  isWork(): boolean {
    return this.type === AddressType.WORK;
  }

  isOther(): boolean {
    return this.type === AddressType.OTHER;
  }

  // =======================
  // 🔐 BUSINESS RULES
  // =======================

  setDefault() {
    this.ensureActive();

    this.isDefault = true;

    this.touch();
  }

  removeDefault() {
    this.isDefault = false;

    this.touch();
  }

  softDelete() {
    if (this.isDeleted()) {
      throw new AddressAlreadyDeletedException({
        addressId: this.id,
      });
    }

    this.deletedAt = new Date();

    this.isDefault = false;

    this.touch();
  }

  restore() {
    this.deletedAt = undefined;

    this.touch();
  }

  updateDetails(params: {
    type?: AddressType;
    fullName?: string;
    phoneNumber?: string;
    alias?: string;
    addressLine1?: string;
    addressLine2?: string;
    landmark?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;

    isDefault?: boolean;
  }) {
    this.ensureActive();

    // =======================
    // 🏷 TYPE
    // =======================

    if (params.type !== undefined) {
      this.type = params.type;
    }

    // =======================
    // 🏷 ALIAS
    // =======================

    if (params.alias !== undefined) {
      this.alias = params.alias;
    }

    if (params.fullName !== undefined) {
      this.fullName = params.fullName;
    }

    if (params.phoneNumber !== undefined) {
      this.phoneNumber = params.phoneNumber;
    }

    // =======================
    // 📍 ADDRESS
    // =======================

    if (params.addressLine1 !== undefined) {
      this.addressLine1 = params.addressLine1;
    }

    if (params.addressLine2 !== undefined) {
      this.addressLine2 = params.addressLine2;
    }

    if (params.landmark !== undefined) {
      this.landmark = params.landmark;
    }

    if (params.city !== undefined) {
      this.city = params.city;
    }

    if (params.state !== undefined) {
      this.state = params.state;
    }

    if (params.country !== undefined) {
      this.country = params.country;
    }

    if (params.postalCode !== undefined) {
      this.postalCode = params.postalCode;
    }

    // =======================
    // 🌍 GEO
    // =======================

    if (params.latitude !== undefined) {
      this.latitude = params.latitude;
    }

    if (params.longitude !== undefined) {
      this.longitude = params.longitude;
    }

    // =======================
    // 🚚 DEFAULT
    // =======================

    if (params.isDefault !== undefined) {
      this.isDefault = params.isDefault;
    }

    // =======================
    // 🔥 VALIDATE
    // =======================

    this.validate();

    this.touch();
  }

  // =======================
  // 🛡️ GUARDS
  // =======================

  ensureActive() {
    if (!this.isActive()) {
      throw new AddressNotActiveException({
        addressId: this.id,
      });
    }
  }

  validate() {
    // =======================
    // 📍 REQUIRED
    // =======================

    if (!this.addressLine1?.trim()) {
      throw new InvalidAddressException({
        field: 'addressLine1',
      });
    }

    if (!this.fullName?.trim()) {
  throw new InvalidAddressException({
    field: 'fullName',
  });
}

if (!this.phoneNumber?.trim()) {
  throw new InvalidAddressException({
    field: 'phoneNumber',
  });
}

    if (!this.city?.trim()) {
      throw new InvalidAddressException({
        field: 'city',
      });
    }

    if (!this.state?.trim()) {
      throw new InvalidAddressException({
        field: 'state',
      });
    }

    if (!this.country?.trim()) {
      throw new InvalidAddressException({
        field: 'country',
      });
    }

    if (!this.postalCode?.trim()) {
      throw new InvalidAddressException({
        field: 'postalCode',
      });
    }

    // =======================
    // 🏷 OTHER VALIDATION
    // =======================

    if (this.isOther() && !this.alias?.trim()) {
      throw new InvalidAddressException({
        field: 'alias',

        message: 'Alias required for OTHER address',
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

// src/modules/saved-address/domain/repositories/saved-address.repository.ts

import { SavedAddress } from '../entities/saved-address.entity';

import { AddressType } from '../enums/address-type.enum';

export interface SavedAddressRepository {
  // =======================
  // 🔍 FIND
  // =======================

  findById(id: string): Promise<SavedAddress | null>;

  findByIdIncludingDeleted(id: string): Promise<SavedAddress | null>;

  findAllByUser(userId: string): Promise<SavedAddress[]>;

  findAllByUserIncludingDeleted(userId: string): Promise<SavedAddress[]>;

  findDefaultByUser(userId: string): Promise<SavedAddress | null>;

  findByType(
    userId: string,

    type: AddressType,
  ): Promise<SavedAddress[]>;

  // 🔥 HOME/WORK CHECK
  findSingleTypeAddress(
    userId: string,

    type: AddressType,
  ): Promise<SavedAddress | null>;

  // =======================
  // 🧠 CHECKS
  // =======================

  existsById(id: string): Promise<boolean>;

  existsDefaultAddress(userId: string): Promise<boolean>;

  // =======================
  // ✍️ WRITE
  // =======================

  create(address: SavedAddress): Promise<SavedAddress>;

  update(address: SavedAddress): Promise<SavedAddress>;

  // =======================
  // 🚚 DEFAULT
  // =======================

  clearDefaultAddresses(userId: string): Promise<void>;

  // =======================
  // ❌ DELETE
  // =======================

  softDelete(id: string): Promise<void>;

  restore(id: string): Promise<void>;

findAllByPhoneNumber(
  phoneNumber: string,
): Promise<SavedAddress[]>;
}

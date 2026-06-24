// src/modules/saved-address/domain/services/saved-address-domain.service.ts

import { Injectable } from '@nestjs/common';

import { AddressType } from '../enums/address-type.enum';

import { SavedAddress } from '../entities/saved-address.entity';

import { HomeAddressAlreadyExistsException } from '../exceptions/home-address-already-exists.exception';

import { WorkAddressAlreadyExistsException } from '../exceptions/work-address-already-exists.exception';

@Injectable()
export class SavedAddressDomainService {
  // =======================
  // 🏠 SINGLE TYPE VALIDATION
  // =======================

  ensureSingleTypeAddress(params: {
    type: AddressType;

    existing?: SavedAddress | null;

    userId: string;
  }) {
    const { type, existing, userId } = params;

    // HOME
    if (type === AddressType.HOME && existing) {
      throw new HomeAddressAlreadyExistsException({
        userId,
      });
    }

    // WORK
    if (type === AddressType.WORK && existing) {
      throw new WorkAddressAlreadyExistsException({
        userId,
      });
    }
  }

  // =======================
  // 🚚 DEFAULT RULE
  // =======================

  shouldSetDefault(existingDefault: SavedAddress | null): boolean {
    return !existingDefault;
  }

  // =======================
  // 🏷 ALIAS RULE
  // =======================

  normalizeAlias(params: {
    type: AddressType;

    alias?: string;
  }): string | undefined {
    const { type, alias } = params;

    // HOME
    if (type === AddressType.HOME) {
      return 'Home';
    }

    // WORK
    if (type === AddressType.WORK) {
      return 'Work';
    }

    // OTHER
    return alias?.trim();
  }
}

// src/modules/saved-address/application/use-cases/delete-saved-address.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SavedAddressRepository } from '../../domain/repositories/saved-address.repository';

import { AddressNotFoundException } from '../../domain/exceptions/address-not-found.exception';

import { AddressAccessDeniedException } from '../../domain/exceptions/address-access-denied.exception';

import { AddressAlreadyDeletedException } from '../../domain/exceptions/address-already-deleted.exception';

@Injectable()
export class DeleteSavedAddressUseCase {
  constructor(
    @Inject(TOKENS.SAVED_ADDRESS_REPO)
    private readonly repo: SavedAddressRepository,
  ) {}

  async execute(input: {
    id: string;

    userId: string;
  }): Promise<{
    success: boolean;

    message: string;
  }> {
    // =======================
    // 🔍 FIND INCLUDING DELETED
    // =======================

    const address = await this.repo.findByIdIncludingDeleted(input.id);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!address) {
      throw new AddressNotFoundException({
        addressId: input.id,
      });
    }

    // =======================
    // 🔐 ACCESS CHECK
    // =======================

    if (address.userId !== input.userId) {
      throw new AddressAccessDeniedException({
        addressId: input.id,

        userId: input.userId,
      });
    }

    // =======================
    // ❌ ALREADY DELETED
    // =======================

    if (address.isDeleted()) {
      throw new AddressAlreadyDeletedException({
        addressId: input.id,
      });
    }

    // =======================
    // 🧠 DOMAIN DELETE
    // =======================

    address.softDelete();

    // =======================
    // 💾 PERSIST
    // =======================

    await this.repo.softDelete(address.id);

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      success: true,

      message: 'Address deleted successfully',
    };
  }
}

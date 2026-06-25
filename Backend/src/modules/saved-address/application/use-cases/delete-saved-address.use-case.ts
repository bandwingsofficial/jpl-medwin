// src/modules/saved-address/application/use-cases/delete-saved-address.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SavedAddressRepository } from '../../domain/repositories/saved-address.repository';

import { AddressNotFoundException } from '../../domain/exceptions/address-not-found.exception';

import { AddressAccessDeniedException } from '../../domain/exceptions/address-access-denied.exception';

import { AddressAlreadyDeletedException } from '../../domain/exceptions/address-already-deleted.exception';

/**
 * Soft-deletes a saved address from the customer's address book.
 *
 * Orders reference addresses via FK + immutable snapshots, so historical orders
 * remain valid after deletion. Deleted addresses are hidden from the address book
 * but are not removed from the database.
 */
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
    const address = await this.repo.findByIdIncludingDeleted(input.id);

    if (!address) {
      throw new AddressNotFoundException({
        addressId: input.id,
      });
    }

    if (address.userId !== input.userId) {
      throw new AddressAccessDeniedException({
        addressId: input.id,

        userId: input.userId,
      });
    }

    if (address.isDeleted()) {
      throw new AddressAlreadyDeletedException({
        addressId: input.id,
      });
    }

    address.softDelete();

    await this.repo.softDelete(address.id);

    return {
      success: true,

      message: 'Address deleted successfully',
    };
  }
}

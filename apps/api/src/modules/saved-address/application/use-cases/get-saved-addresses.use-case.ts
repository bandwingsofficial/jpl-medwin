// src/modules/saved-address/application/use-cases/get-saved-addresses.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SavedAddressRepository } from '../../domain/repositories/saved-address.repository';

import { SavedAddress } from '../../domain/entities/saved-address.entity';

@Injectable()
export class GetSavedAddressesUseCase {
  constructor(
    @Inject(TOKENS.SAVED_ADDRESS_REPO)
    private readonly repo: SavedAddressRepository,
  ) {}

  async execute(input: {
    userId: string;

    includeDeleted?: boolean;
  }): Promise<SavedAddress[]> {
    // =======================
    // ♻️ INCLUDE DELETED
    // =======================

    if (input.includeDeleted) {
      return this.repo.findAllByUserIncludingDeleted(input.userId);
    }

    // =======================
    // 📦 ACTIVE ONLY
    // =======================

    return this.repo.findAllByUser(input.userId);
  }
}

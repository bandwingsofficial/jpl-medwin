// src/modules/saved-address/application/services/saved-address-default.service.ts

import { Injectable, Inject } from '@nestjs/common';

import { SavedAddressRepository } from '../../domain/repositories/saved-address.repository';
import { TOKENS } from '@/common/constants/tokens';

@Injectable()
export class SavedAddressDefaultService {
  constructor(
    @Inject(TOKENS.SAVED_ADDRESS_REPO)
    private readonly repo: SavedAddressRepository,
  ) {}

  async handleDefaultAddress(params: {
    userId: string;

    isDefault?: boolean;
  }) {
    if (!params.isDefault) {
      return;
    }

    await this.repo.clearDefaultAddresses(params.userId);
  }
}

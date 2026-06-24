// src/modules/saved-address/application/use-cases/create-saved-address.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SavedAddressRepository } from '../../domain/repositories/saved-address.repository';

import { SavedAddressDomainService } from '../../domain/services/saved-address-domain.service';

import { AddressType } from '../../domain/enums/address-type.enum';

import { CreateSavedAddressService } from '../services/create-saved-address.service';

import { SavedAddressDefaultService } from '../services/saved-address-default.service';

import { SavedAddress } from '../../domain/entities/saved-address.entity';

@Injectable()
export class CreateSavedAddressUseCase {
  constructor(
    @Inject(TOKENS.SAVED_ADDRESS_REPO)
    private readonly repo: SavedAddressRepository,

    private readonly domainService: SavedAddressDomainService,

    private readonly createService: CreateSavedAddressService,

    private readonly defaultService: SavedAddressDefaultService,
  ) {}

  async execute(input: {
    userId: string;
    fullName?: string;
phoneNumber: string;
    type: AddressType;
    alias?: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
  }): Promise<SavedAddress> {
    // =======================
    // 🏠 SINGLE TYPE CHECK
    // =======================

    if (input.type === AddressType.HOME || input.type === AddressType.WORK) {
      const existing = await this.repo.findSingleTypeAddress(input.userId, input.type);

      this.domainService.ensureSingleTypeAddress({
        type: input.type,
        existing,
        userId: input.userId,
      });
    }

    // =======================
    // 🏷 NORMALIZE ALIAS
    // =======================

    const alias = this.domainService.normalizeAlias({
      type: input.type,
      alias: input.alias,
    });

    // =======================
    // 🚚 HANDLE DEFAULT
    // =======================

    await this.defaultService.handleDefaultAddress({
      userId: input.userId,
      isDefault: input.isDefault,
    });

    // =======================
    // 🏗 BUILD ENTITY
    // =======================

    const address = this.createService.build({
      ...input,

      alias,
    });

    // =======================
    // 💾 SAVE
    // =======================

    return this.repo.create(address);
  }
}

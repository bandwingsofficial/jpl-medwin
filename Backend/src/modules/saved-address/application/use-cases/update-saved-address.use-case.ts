// src/modules/saved-address/application/use-cases/update-saved-address.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SavedAddressRepository } from '../../domain/repositories/saved-address.repository';

import { SavedAddressDomainService } from '../../domain/services/saved-address-domain.service';

import { AddressType } from '../../domain/enums/address-type.enum';

import { SavedAddress } from '../../domain/entities/saved-address.entity';

import { AddressNotFoundException } from '../../domain/exceptions/address-not-found.exception';

import { AddressAccessDeniedException } from '../../domain/exceptions/address-access-denied.exception';

import { UpdateSavedAddressService } from '../services/update-saved-address.service';

import { SavedAddressDefaultService } from '../services/saved-address-default.service';

@Injectable()
export class UpdateSavedAddressUseCase {
  constructor(
    @Inject(TOKENS.SAVED_ADDRESS_REPO)
    private readonly repo: SavedAddressRepository,

    private readonly domainService: SavedAddressDomainService,

    private readonly updateService: UpdateSavedAddressService,

    private readonly defaultService: SavedAddressDefaultService,
  ) {}

  async execute(input: {
    id: string;
    
    fullName?: string;
phoneNumber?: string;
    userId: string;

    type?: AddressType;

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
  }): Promise<SavedAddress> {
    // =======================
    // 🔍 FIND
    // =======================

    const address = await this.repo.findById(input.id);

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
    // 🏠 SINGLE TYPE CHECK
    // =======================

    const nextType = input.type ?? address.type;

    if (nextType === AddressType.HOME || nextType === AddressType.WORK) {
      const existing = await this.repo.findSingleTypeAddress(input.userId, nextType);

      if (existing && existing.id !== address.id) {
        this.domainService.ensureSingleTypeAddress({
          type: nextType,

          existing,

          userId: input.userId,
        });
      }
    }

    // =======================
    // 🏷 NORMALIZE ALIAS
    // =======================

    const alias = this.domainService.normalizeAlias({
      type: nextType,

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
    // ✍️ UPDATE ENTITY
    // =======================

    this.updateService.update(address, {
      ...input,

      type: nextType,

      alias,
    });

    // =======================
    // 💾 SAVE
    // =======================

    return this.repo.update(address);
  }
}

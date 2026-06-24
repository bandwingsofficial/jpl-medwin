// src/modules/saved-address/application/services/update-saved-address.service.ts

import { Injectable } from '@nestjs/common';

import { SavedAddress } from '../../domain/entities/saved-address.entity';

import { AddressType } from '../../domain/enums/address-type.enum';

@Injectable()
export class UpdateSavedAddressService {
  update(
    address: SavedAddress,

    params: {
      fullName?: string;

phoneNumber?: string;

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
    },
  ) {
    address.updateDetails(params);

    return address;
  }
}

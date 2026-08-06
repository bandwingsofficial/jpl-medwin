// src/modules/saved-address/application/services/create-saved-address.service.ts

import { Injectable } from '@nestjs/common';

import { SavedAddress } from '../../domain/entities/saved-address.entity';

import { AddressType } from '../../domain/enums/address-type.enum';

@Injectable()
export class CreateSavedAddressService {
  build(params: {
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
  }) {
    const address = new SavedAddress(
      crypto.randomUUID(),

      params.userId,

      params.fullName,

      params.phoneNumber,

      params.type,

      params.addressLine1,

      params.city,

      params.state,

      params.country,

      params.postalCode,

      params.alias,

      params.addressLine2,

      params.landmark,

      params.latitude,

      params.longitude,

      params.isDefault ?? false,
    );

    address.validate();

    return address;
  }
}

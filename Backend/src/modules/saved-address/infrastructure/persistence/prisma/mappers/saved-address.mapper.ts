// src/modules/saved-address/infrastructure/persistence/prisma/mappers/saved-address.mapper.ts

import {
  SavedAddress as PrismaSavedAddress,
  AddressType as PrismaAddressType,
} from '@prisma/client';

import { SavedAddress } from '../../../../domain/entities/saved-address.entity';

import { AddressType } from '../../../../domain/enums/address-type.enum';
import { InvalidEnumMappingException } from '@/common/exceptions/invalid-enum-mapping.exception';

export class SavedAddressMapper {
  // =======================
  // 🔄 ENUM MAPPING
  // =======================

  private static toDomainType(type: PrismaAddressType): AddressType {
    switch (type) {
      case PrismaAddressType.HOME:
        return AddressType.HOME;

      case PrismaAddressType.WORK:
        return AddressType.WORK;

      case PrismaAddressType.OTHER:
        return AddressType.OTHER;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Prisma address type', value: type, direction: 'prisma_to_domain' });
    }
  }

  private static toPrismaType(type: AddressType): PrismaAddressType {
    switch (type) {
      case AddressType.HOME:
        return PrismaAddressType.HOME;

      case AddressType.WORK:
        return PrismaAddressType.WORK;

      case AddressType.OTHER:
        return PrismaAddressType.OTHER;

      default:
        throw new InvalidEnumMappingException({ enumName: 'Unknown Domain address type', value: type, direction: 'domain_to_prisma' });
    }
  }

  // =======================
  // 🏠 ADDRESS
  // =======================

  static toDomain(p: PrismaSavedAddress): SavedAddress {
    return new SavedAddress(
      p.id,

      p.userId,

  p.fullName ?? undefined,

  p.phoneNumber,

      this.toDomainType(p.type),

      // =======================
      // 📍 REQUIRED ADDRESS
      // =======================

      p.addressLine1,

      p.city,

      p.state,

      p.country,

      p.postalCode,

      // =======================
      // 📍 OPTIONAL
      // =======================

      p.alias ?? undefined,

      p.addressLine2 ?? undefined,

      p.landmark ?? undefined,

      // =======================
      // 🌍 GEO
      // =======================

      p.latitude ? Number(p.latitude) : undefined,

      p.longitude ? Number(p.longitude) : undefined,

      // =======================
      // 🚚 FLAGS
      // =======================

      p.isDefault,

      // =======================
      // 🕒 SYSTEM
      // =======================

      p.createdAt,

      p.updatedAt,

      p.deletedAt ?? undefined,
    );
  }

  static toPersistence(e: SavedAddress) {
    return {
      id: e.id,

      userId: e.userId,
      fullName: e.fullName ?? null,

phoneNumber: e.phoneNumber,

      type: this.toPrismaType(e.type),

      alias: e.alias ?? null,

      addressLine1: e.addressLine1,

      addressLine2: e.addressLine2 ?? null,

      landmark: e.landmark ?? null,

      city: e.city,

      state: e.state,

      country: e.country,

      postalCode: e.postalCode,

      latitude: e.latitude ?? null,

      longitude: e.longitude ?? null,

      isDefault: e.isDefault,

      createdAt: e.createdAt,

      updatedAt: e.updatedAt,

      deletedAt: e.deletedAt ?? null,
    };
  }
}

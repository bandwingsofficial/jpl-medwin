import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';

import {
  ORDER_ADDRESS_SNAPSHOT_VERSION,
  OrderAddressSnapshotPayload,
  OrderAddressSnapshotRecord,
  OrderAddressSnapshotStored,
} from '../../domain/types/order-address-snapshot.type';

export class OrderAddressSnapshotMapper {
  static fromSavedAddress(
    address: SavedAddress,
    capturedAt: Date = new Date(),
  ): OrderAddressSnapshotRecord {
    return {
      version: ORDER_ADDRESS_SNAPSHOT_VERSION,
      capturedAt: capturedAt.toISOString(),
      address: this.payloadFromSavedAddress(address),
    };
  }

  static payloadFromSavedAddress(address: SavedAddress): OrderAddressSnapshotPayload {
    return {
      id: address.id,
      fullName: address.fullName ?? null,
      phoneNumber: address.phoneNumber,
      type: address.type,
      alias: address.alias ?? null,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 ?? null,
      landmark: address.landmark ?? null,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      latitude: address.latitude ?? null,
      longitude: address.longitude ?? null,
      isDefault: address.isDefault,
    };
  }

  static isVersionedRecord(
    value: Record<string, unknown>,
  ): value is OrderAddressSnapshotRecord & Record<string, unknown> {
    return (
      value.version === ORDER_ADDRESS_SNAPSHOT_VERSION &&
      typeof value.capturedAt === 'string' &&
      value.address !== null &&
      typeof value.address === 'object' &&
      !Array.isArray(value.address)
    );
  }

  static isLegacyPayload(
    value: Record<string, unknown>,
  ): value is OrderAddressSnapshotPayload & Record<string, unknown> {
    return (
      typeof value.id === 'string' &&
      typeof value.phoneNumber === 'string' &&
      typeof value.addressLine1 === 'string' &&
      typeof value.city === 'string' &&
      typeof value.state === 'string' &&
      typeof value.country === 'string' &&
      typeof value.postalCode === 'string'
    );
  }

  static payloadFromUnknown(value: unknown): OrderAddressSnapshotPayload | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    const snapshot = value as Record<string, unknown>;

    if (this.isVersionedRecord(snapshot)) {
      return this.payloadFromUnknown(snapshot.address);
    }

    if (!this.isLegacyPayload(snapshot)) {
      return undefined;
    }

    return {
      id: snapshot.id,
      fullName: typeof snapshot.fullName === 'string' ? snapshot.fullName : null,
      phoneNumber: snapshot.phoneNumber,
      type: typeof snapshot.type === 'string' ? snapshot.type : 'HOME',
      alias: typeof snapshot.alias === 'string' ? snapshot.alias : null,
      addressLine1: snapshot.addressLine1,
      addressLine2: typeof snapshot.addressLine2 === 'string' ? snapshot.addressLine2 : null,
      landmark: typeof snapshot.landmark === 'string' ? snapshot.landmark : null,
      city: snapshot.city,
      state: snapshot.state,
      country: snapshot.country,
      postalCode: snapshot.postalCode,
      latitude: typeof snapshot.latitude === 'number' ? snapshot.latitude : null,
      longitude: typeof snapshot.longitude === 'number' ? snapshot.longitude : null,
      isDefault: snapshot.isDefault === true,
    };
  }

  static fromUnknown(value: unknown): OrderAddressSnapshotStored | undefined {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return undefined;
    }

    const snapshot = value as Record<string, unknown>;

    if (this.isVersionedRecord(snapshot)) {
      const address = this.payloadFromUnknown(snapshot.address);

      if (!address) {
        return undefined;
      }

      return {
        version: ORDER_ADDRESS_SNAPSHOT_VERSION,
        capturedAt: snapshot.capturedAt,
        address,
      };
    }

    return this.payloadFromUnknown(snapshot);
  }

  static toPayload(
    stored?: OrderAddressSnapshotStored | null,
  ): OrderAddressSnapshotPayload | undefined {
    if (!stored) {
      return undefined;
    }

    if ('version' in stored && 'address' in stored) {
      return stored.address;
    }

    return stored;
  }
}

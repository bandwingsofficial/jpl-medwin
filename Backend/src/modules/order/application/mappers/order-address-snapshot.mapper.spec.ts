import { AddressType } from '@/modules/saved-address/domain/enums/address-type.enum';
import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';

import { ORDER_ADDRESS_SNAPSHOT_VERSION } from '../../domain/types/order-address-snapshot.type';

import { OrderAddressSnapshotMapper } from './order-address-snapshot.mapper';

describe('OrderAddressSnapshotMapper', () => {
  it('creates a versioned snapshot from SavedAddress', () => {
    const capturedAt = new Date('2024-06-16T12:00:00.000Z');
    const address = new SavedAddress(
      'addr-1',
      'user-1',
      'Akshay',
      '9999999999',
      AddressType.HOME,
      'Whitefield',
      'Bangalore',
      'Karnataka',
      'India',
      '560066',
      'Home',
      'Apt 2',
      'Near mall',
      12.97,
      77.59,
      true,
    );

    const snapshot = OrderAddressSnapshotMapper.fromSavedAddress(address, capturedAt);

    expect(snapshot.version).toBe(ORDER_ADDRESS_SNAPSHOT_VERSION);
    expect(snapshot.capturedAt).toBe('2024-06-16T12:00:00.000Z');
    expect(snapshot.address).toEqual({
      id: 'addr-1',
      fullName: 'Akshay',
      phoneNumber: '9999999999',
      type: AddressType.HOME,
      alias: 'Home',
      addressLine1: 'Whitefield',
      addressLine2: 'Apt 2',
      landmark: 'Near mall',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
      latitude: 12.97,
      longitude: 77.59,
      isDefault: true,
    });
  });

  it('parses versioned snapshot JSON', () => {
    const snapshot = OrderAddressSnapshotMapper.fromUnknown({
      version: 1,
      capturedAt: '2024-06-16T12:00:00.000Z',
      address: {
        id: 'addr-1',
        fullName: 'Akshay',
        phoneNumber: '9999999999',
        type: 'HOME',
        alias: null,
        addressLine1: 'Whitefield',
        addressLine2: null,
        landmark: null,
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560066',
        latitude: null,
        longitude: null,
        isDefault: false,
      },
    });

    expect(snapshot?.version).toBe(1);
    expect(snapshot?.capturedAt).toBe('2024-06-16T12:00:00.000Z');
    expect(snapshot && 'address' in snapshot && snapshot.address.city).toBe('Bangalore');
  });

  it('parses legacy flat snapshot JSON', () => {
    const snapshot = OrderAddressSnapshotMapper.fromUnknown({
      id: 'addr-1',
      fullName: 'Akshay',
      phoneNumber: '9999999999',
      type: 'HOME',
      alias: null,
      addressLine1: 'Whitefield',
      addressLine2: null,
      landmark: null,
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
      latitude: null,
      longitude: null,
      isDefault: false,
    });

    expect(OrderAddressSnapshotMapper.toPayload(snapshot)?.city).toBe('Bangalore');
  });

  it('returns undefined for invalid snapshot payloads', () => {
    expect(OrderAddressSnapshotMapper.fromUnknown(null)).toBeUndefined();
    expect(OrderAddressSnapshotMapper.fromUnknown({})).toBeUndefined();
    expect(OrderAddressSnapshotMapper.fromUnknown({ id: 'addr-1' })).toBeUndefined();
  });

  it('keeps snapshot unchanged when source SavedAddress is later modified', () => {
    const address = new SavedAddress(
      'addr-1',
      'user-1',
      'Akshay',
      '9999999999',
      AddressType.HOME,
      'Whitefield',
      'Bangalore',
      'Karnataka',
      'India',
      '560066',
    );

    const snapshot = OrderAddressSnapshotMapper.fromSavedAddress(address);

    address.updateDetails({
      fullName: 'Changed Name',
      addressLine1: 'Changed Street',
    });

    expect(snapshot.address.fullName).toBe('Akshay');
    expect(snapshot.address.addressLine1).toBe('Whitefield');
  });
});

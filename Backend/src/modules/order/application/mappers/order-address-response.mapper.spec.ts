import { AddressType } from '@/modules/saved-address/domain/enums/address-type.enum';
import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';

import { Order } from '../../domain/entities/order.entity';
import { ORDER_ADDRESS_SNAPSHOT_VERSION } from '../../domain/types/order-address-snapshot.type';

import { OrderAddressResponseMapper } from './order-address-response.mapper';

describe('OrderAddressResponseMapper', () => {
  const liveAddress = new SavedAddress(
    'addr-1',
    'user-1',
    'Updated Name',
    '9999999999',
    AddressType.HOME,
    'Updated Street',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
    'Home',
    undefined,
    undefined,
    undefined,
    undefined,
    true,
  );

  const versionedSnapshot = {
    version: ORDER_ADDRESS_SNAPSHOT_VERSION,
    capturedAt: '2024-06-16T12:00:00.000Z',
    address: {
      id: 'addr-1',
      fullName: 'Akshay',
      phoneNumber: '9999999999',
      type: AddressType.HOME,
      alias: 'Home',
      addressLine1: 'Whitefield',
      addressLine2: null,
      landmark: null,
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
      latitude: null,
      longitude: null,
      isDefault: true,
    },
  };

  const legacySnapshot = versionedSnapshot.address;

  const buildOrder = (overrides: Partial<Order> = {}) => {
    const order = new Order('order-1', 'ORD-001');

    Object.assign(order, {
      shippingAddressId: 'addr-1',
      billingAddressId: 'addr-2',
      isBillingSameAsShipping: false,
      shippingAddressSnapshot: versionedSnapshot,
      billingAddressSnapshot: {
        ...versionedSnapshot,
        address: {
          ...versionedSnapshot.address,
          id: 'addr-2',
          type: AddressType.WORK,
          alias: 'Office',
          addressLine1: 'ITPL',
        },
      },
      shippingAddress: liveAddress,
      billingAddress: liveAddress,
      ...overrides,
    });

    return order;
  };

  it('prefers versioned shipping snapshot over live SavedAddress', () => {
    const fields = OrderAddressResponseMapper.toOrderAddressFields(buildOrder());

    expect(fields.shippingAddress).toEqual(versionedSnapshot.address);
    expect(fields.shippingAddress?.fullName).toBe('Akshay');
  });

  it('prefers versioned billing snapshot over live SavedAddress', () => {
    const fields = OrderAddressResponseMapper.toOrderAddressFields(buildOrder());

    expect(fields.billingAddress?.id).toBe('addr-2');
    expect(fields.billingAddress?.addressLine1).toBe('ITPL');
  });

  it('supports legacy flat snapshot format', () => {
    const order = buildOrder({
      shippingAddressSnapshot: legacySnapshot,
      billingAddressSnapshot: legacySnapshot,
    });

    const fields = OrderAddressResponseMapper.toOrderAddressFields(order);

    expect(fields.shippingAddress?.addressLine1).toBe('Whitefield');
  });

  it('falls back to live address when snapshot is missing', () => {
    const order = buildOrder({
      shippingAddressSnapshot: undefined,
      billingAddressSnapshot: undefined,
    });

    const fields = OrderAddressResponseMapper.toOrderAddressFields(order);

    expect(fields.shippingAddress?.fullName).toBe('Updated Name');
    expect(fields.shippingAddress?.addressLine1).toBe('Updated Street');
  });

  it('returns null instead of empty objects when address is unavailable', () => {
    const order = buildOrder({
      shippingAddressSnapshot: undefined,
      billingAddressSnapshot: undefined,
      shippingAddress: undefined,
      billingAddress: undefined,
    });

    const fields = OrderAddressResponseMapper.toOrderAddressFields(order);

    expect(fields.shippingAddress).toBeNull();
    expect(fields.billingAddress).toBeNull();
  });
});

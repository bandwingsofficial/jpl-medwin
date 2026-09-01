import { AddressType } from '@/modules/saved-address/domain/enums/address-type.enum';
import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';
import { SavedAddressRepository } from '@/modules/saved-address/domain/repositories/saved-address.repository';

import { OrderBillingAddressNotFoundException } from '../../domain/exceptions/order-billing-address-not-found.exception';
import { OrderShippingAddressNotFoundException } from '../../domain/exceptions/order-shipping-address-not-found.exception';
import { OrderAddressAccessDeniedException } from '../../domain/exceptions/order-address-access-denied.exception';
import { OrderAddressInactiveException } from '../../domain/exceptions/order-address-inactive.exception';

import { OrderAddressValidationService } from '../services/order-address-validation.service';

describe('OrderAddressValidationService', () => {
  const userId = 'user-1';

  const shippingAddress = new SavedAddress(
    'ship-1',
    userId,
    'Akshay',
    '9999999999',
    AddressType.HOME,
    'Whitefield',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  const billingAddress = new SavedAddress(
    'bill-1',
    userId,
    'Akshay',
    '9999999999',
    AddressType.WORK,
    'ITPL',
    'Bangalore',
    'Karnataka',
    'India',
    '560066',
  );

  let repo: jest.Mocked<SavedAddressRepository>;
  let service: OrderAddressValidationService;

  beforeEach(() => {
    repo = {
      findByIdIncludingDeleted: jest.fn(),
    } as unknown as jest.Mocked<SavedAddressRepository>;

    service = new OrderAddressValidationService(repo);
  });

  it('uses shipping address for billing when isBillingSameAsShipping is true', async () => {
    repo.findByIdIncludingDeleted.mockResolvedValue(shippingAddress);

    const result = await service.validateForOrderCreation({
      userId,
      shippingAddressId: 'ship-1',
      isBillingSameAsShipping: true,
    });

    expect(result.billingAddressId).toBe('ship-1');
    expect(result.isBillingSameAsShipping).toBe(true);
    expect(repo.findByIdIncludingDeleted.mock.calls).toHaveLength(1);
  });

  it('validates separate billing address when isBillingSameAsShipping is false', async () => {
    repo.findByIdIncludingDeleted.mockImplementation((id: string) => {
      if (id === 'ship-1') {
        return Promise.resolve(shippingAddress);
      }

      if (id === 'bill-1') {
        return Promise.resolve(billingAddress);
      }

      return Promise.resolve(null);
    });

    const result = await service.validateForOrderCreation({
      userId,
      shippingAddressId: 'ship-1',
      billingAddressId: 'bill-1',
      isBillingSameAsShipping: false,
    });

    expect(result.billingAddressId).toBe('bill-1');
    expect(result.isBillingSameAsShipping).toBe(false);
  });

  it('throws when shipping address is missing', async () => {
    repo.findByIdIncludingDeleted.mockResolvedValue(null);

    await expect(
      service.validateForOrderCreation({
        userId,
        shippingAddressId: 'missing',
      }),
    ).rejects.toBeInstanceOf(OrderShippingAddressNotFoundException);
  });

  it('throws when billing address is missing', async () => {
    repo.findByIdIncludingDeleted.mockImplementation((id: string) => {
      if (id === 'ship-1') {
        return Promise.resolve(shippingAddress);
      }

      return Promise.resolve(null);
    });

    await expect(
      service.validateForOrderCreation({
        userId,
        shippingAddressId: 'ship-1',
        billingAddressId: 'missing',
        isBillingSameAsShipping: false,
      }),
    ).rejects.toBeInstanceOf(OrderBillingAddressNotFoundException);
  });

  it('throws when address belongs to another user', async () => {
    const foreignAddress = new SavedAddress(
      'ship-1',
      'other-user',
      'Akshay',
      '9999999999',
      AddressType.HOME,
      'Whitefield',
      'Bangalore',
      'Karnataka',
      'India',
      '560066',
    );

    repo.findByIdIncludingDeleted.mockResolvedValue(foreignAddress);

    await expect(
      service.validateForOrderCreation({
        userId,
        shippingAddressId: 'ship-1',
      }),
    ).rejects.toBeInstanceOf(OrderAddressAccessDeniedException);
  });

  it('throws when address is inactive', async () => {
    const deletedAddress = new SavedAddress(
      'ship-1',
      userId,
      'Akshay',
      '9999999999',
      AddressType.HOME,
      'Whitefield',
      'Bangalore',
      'Karnataka',
      'India',
      '560066',
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      new Date(),
    );

    deletedAddress.softDelete();

    repo.findByIdIncludingDeleted.mockResolvedValue(deletedAddress);

    await expect(
      service.validateForOrderCreation({
        userId,
        shippingAddressId: 'ship-1',
      }),
    ).rejects.toBeInstanceOf(OrderAddressInactiveException);
  });
});

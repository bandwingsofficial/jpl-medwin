import { AddressType } from '@/modules/saved-address/domain/enums/address-type.enum';
import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';
import { SavedAddressRepository } from '@/modules/saved-address/domain/repositories/saved-address.repository';

import { DeleteSavedAddressUseCase } from './delete-saved-address.use-case';

describe('DeleteSavedAddressUseCase', () => {
  const userId = 'user-1';
  const addressId = 'addr-1';

  let repo: jest.Mocked<SavedAddressRepository>;
  let useCase: DeleteSavedAddressUseCase;

  beforeEach(() => {
    repo = {
      findByIdIncludingDeleted: jest.fn(),
      countOrderReferences: jest.fn(),
      softDelete: jest.fn(),
    } as unknown as jest.Mocked<SavedAddressRepository>;

    useCase = new DeleteSavedAddressUseCase(repo);
  });

  it('allows soft deletion when address is referenced by existing orders', async () => {
    repo.findByIdIncludingDeleted.mockResolvedValue(
      new SavedAddress(
        addressId,
        userId,
        'Akshay',
        '9999999999',
        AddressType.HOME,
        'Whitefield',
        'Bangalore',
        'Karnataka',
        'India',
        '560066',
      ),
    );
    repo.softDelete.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: addressId, userId });

    expect(result.success).toBe(true);
    expect(repo.softDelete.mock.calls).toEqual([[addressId]]);
    expect(repo.countOrderReferences.mock.calls).toHaveLength(0);
  });

  it('soft deletes address when it is not referenced by orders', async () => {
    repo.findByIdIncludingDeleted.mockResolvedValue(
      new SavedAddress(
        addressId,
        userId,
        'Akshay',
        '9999999999',
        AddressType.HOME,
        'Whitefield',
        'Bangalore',
        'Karnataka',
        'India',
        '560066',
      ),
    );
    repo.softDelete.mockResolvedValue(undefined);

    const result = await useCase.execute({ id: addressId, userId });

    expect(result.success).toBe(true);
    expect(repo.softDelete.mock.calls).toEqual([[addressId]]);
  });
});

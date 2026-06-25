import { Prisma } from '@prisma/client';

import { ErrorCode } from '@/common/constants/error-codes';

import { ShippingConfiguration } from '../../domain/entities/shipping-configuration.entity';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

import { ActiveShippingConfigurationCannotBeDeletedException } from '../../domain/exceptions/active-shipping-configuration-cannot-be-deleted.exception';

import { AtLeastOneActiveShippingConfigurationRequiredException } from '../../domain/exceptions/at-least-one-active-shipping-configuration-required.exception';

import { CreateShippingConfigurationUseCase } from './create-shipping-configuration.use-case';

import { UpdateShippingConfigurationUseCase } from './update-shipping-configuration.use-case';

import { DeleteShippingConfigurationUseCase } from './delete-shipping-configuration.use-case';

describe('Shipping configuration active rules', () => {
  const tx = {} as Prisma.TransactionClient;

  let configs: Map<string, ShippingConfiguration>;
  let repository: jest.Mocked<ShippingConfigurationRepository>;
  let prisma: { $transaction: jest.Mock };

  let createUseCase: CreateShippingConfigurationUseCase;
  let updateUseCase: UpdateShippingConfigurationUseCase;
  let deleteUseCase: DeleteShippingConfigurationUseCase;

  const config = (
    id: string,
    shippingFee: number,
    freeShippingThreshold: number,
    isActive: boolean,
  ) => new ShippingConfiguration(id, shippingFee, freeShippingThreshold, isActive);

  const countActive = () => [...configs.values()].filter((item) => item.isActive).length;

  beforeEach(() => {
    configs = new Map();

    repository = {
      findById: jest.fn((id: string) => Promise.resolve(configs.get(id) ?? null)),
      findActive: jest.fn(() =>
        Promise.resolve([...configs.values()].find((item) => item.isActive) ?? null),
      ),
      findAll: jest.fn(() => Promise.resolve([...configs.values()])),
      countAll: jest.fn(() => Promise.resolve(configs.size)),
      countActive: jest.fn(() => Promise.resolve(countActive())),
      create: jest.fn((configuration: ShippingConfiguration) => {
        configs.set(configuration.id, configuration);
        return Promise.resolve(configuration);
      }),
      update: jest.fn((configuration: ShippingConfiguration) => {
        configs.set(configuration.id, configuration);
        return Promise.resolve(configuration);
      }),
      deactivateAll: jest.fn(() => {
        for (const item of configs.values()) {
          if (item.isActive) {
            item.deactivate();
          }
        }
        return Promise.resolve();
      }),
      delete: jest.fn((id: string) => {
        configs.delete(id);
        return Promise.resolve();
      }),
    } as unknown as jest.Mocked<ShippingConfigurationRepository>;

    prisma = {
      $transaction: jest.fn((callback: (client: Prisma.TransactionClient) => Promise<unknown>) =>
        callback(tx),
      ),
    };

    createUseCase = new CreateShippingConfigurationUseCase(prisma as never, repository);

    updateUseCase = new UpdateShippingConfigurationUseCase(prisma as never, repository);

    deleteUseCase = new DeleteShippingConfigurationUseCase(repository);
  });

  it('creates the first configuration as active even when isActive is omitted', async () => {
    const result = await createUseCase.execute({
      shippingFee: 50,
      freeShippingThreshold: 500,
    });

    expect(result.isActive).toBe(true);
    expect(countActive()).toBe(1);
  });

  it('forces the first configuration active even when isActive is false', async () => {
    const result = await createUseCase.execute({
      shippingFee: 50,
      freeShippingThreshold: 500,
      isActive: false,
    });

    expect(result.isActive).toBe(true);
    expect(countActive()).toBe(1);
  });

  it('activates a configuration and deactivates all others', async () => {
    configs.set('config-a', config('config-a', 50, 500, false));
    configs.set('config-b', config('config-b', 75, 600, true));
    configs.set('config-c', config('config-c', 100, 700, false));

    const result = await updateUseCase.execute({
      id: 'config-a',
      isActive: true,
    });

    expect(result.isActive).toBe(true);
    expect(configs.get('config-a')?.isActive).toBe(true);
    expect(configs.get('config-b')?.isActive).toBe(false);
    expect(configs.get('config-c')?.isActive).toBe(false);
    expect(countActive()).toBe(1);
    expect(repository.deactivateAll.mock.calls).toEqual([[tx]]);
  });

  it('creates a new active configuration and deactivates the previous active one', async () => {
    configs.set('old-config', config('old-config', 50, 500, true));

    const result = await createUseCase.execute({
      shippingFee: 100,
      freeShippingThreshold: 3000,
      isActive: true,
    });

    expect(result.isActive).toBe(true);
    expect(configs.get('old-config')?.isActive).toBe(false);
    expect(countActive()).toBe(1);
    expect(repository.deactivateAll.mock.calls).toEqual([[tx]]);
  });

  it('allows deleting an inactive configuration', async () => {
    configs.set('config-a', config('config-a', 50, 500, false));
    configs.set('config-b', config('config-b', 75, 600, true));

    const result = await deleteUseCase.execute({ id: 'config-a' });

    expect(result.success).toBe(true);
    expect(configs.has('config-a')).toBe(false);
    expect(countActive()).toBe(1);
  });

  it('blocks deleting the active configuration', async () => {
    configs.set('config-a', config('config-a', 50, 500, false));
    configs.set('config-c', config('config-c', 100, 700, true));

    await expect(deleteUseCase.execute({ id: 'config-c' })).rejects.toBeInstanceOf(
      ActiveShippingConfigurationCannotBeDeletedException,
    );

    await expect(deleteUseCase.execute({ id: 'config-c' })).rejects.toMatchObject({
      response: {
        errorCode: ErrorCode.SHIPPING_CONFIGURATION.ACTIVE_CANNOT_BE_DELETED,
        message:
          'Active shipping configuration cannot be deleted. Activate another configuration first.',
      },
    });

    expect(configs.has('config-c')).toBe(true);
    expect(countActive()).toBe(1);
  });

  it('blocks deactivating the only active configuration', async () => {
    configs.set('config-a', config('config-a', 50, 500, true));

    await expect(
      updateUseCase.execute({
        id: 'config-a',
        isActive: false,
      }),
    ).rejects.toBeInstanceOf(AtLeastOneActiveShippingConfigurationRequiredException);

    await expect(
      updateUseCase.execute({
        id: 'config-a',
        isActive: false,
      }),
    ).rejects.toMatchObject({
      response: {
        errorCode: ErrorCode.SHIPPING_CONFIGURATION.AT_LEAST_ONE_ACTIVE_REQUIRED,
        message: 'At least one active shipping configuration is required.',
      },
    });

    expect(configs.get('config-a')?.isActive).toBe(true);
    expect(countActive()).toBe(1);
  });

  it('keeps exactly one active configuration after activation switches', async () => {
    configs.set('config-a', config('config-a', 50, 500, false));
    configs.set('config-b', config('config-b', 75, 600, true));
    configs.set('config-c', config('config-c', 100, 700, false));

    await updateUseCase.execute({
      id: 'config-c',
      isActive: true,
    });

    expect(countActive()).toBe(1);
    expect(configs.get('config-c')?.isActive).toBe(true);
    expect(configs.get('config-b')?.isActive).toBe(false);
  });
});

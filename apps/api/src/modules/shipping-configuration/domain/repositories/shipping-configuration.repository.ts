import { Prisma } from '@prisma/client';

import { ShippingConfiguration } from '../entities/shipping-configuration.entity';

export interface ShippingConfigurationRepository {
  findById(id: string, tx?: Prisma.TransactionClient): Promise<ShippingConfiguration | null>;

  findActive(tx?: Prisma.TransactionClient): Promise<ShippingConfiguration | null>;

  findAll(): Promise<ShippingConfiguration[]>;

  countAll(tx?: Prisma.TransactionClient): Promise<number>;

  countActive(tx?: Prisma.TransactionClient): Promise<number>;

  create(
    configuration: ShippingConfiguration,
    tx?: Prisma.TransactionClient,
  ): Promise<ShippingConfiguration>;

  update(
    configuration: ShippingConfiguration,
    tx?: Prisma.TransactionClient,
  ): Promise<ShippingConfiguration>;

  deactivateAll(tx?: Prisma.TransactionClient): Promise<void>;

  delete(id: string): Promise<void>;
}

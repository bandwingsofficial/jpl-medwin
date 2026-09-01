import { ShippingConfiguration as PrismaShippingConfiguration } from '@prisma/client';

import { ShippingConfiguration } from '../../../../domain/entities/shipping-configuration.entity';

export class ShippingConfigurationMapper {
  static toDomain(record: PrismaShippingConfiguration): ShippingConfiguration {
    return new ShippingConfiguration(
      record.id,
      Number(record.shippingFee),
      Number(record.freeShippingThreshold),
      Number(record.overweightChargePerKg ?? 0),
      record.isActive,
      record.createdAt,
      record.updatedAt,
    );
  }

  static toPersistence(entity: ShippingConfiguration) {
    return {
      id: entity.id,
      shippingFee: entity.shippingFee,
      freeShippingThreshold: entity.freeShippingThreshold,
      overweightChargePerKg: entity.overweightChargePerKg,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

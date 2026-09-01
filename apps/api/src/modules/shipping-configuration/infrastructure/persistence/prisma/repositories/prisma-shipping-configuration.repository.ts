import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../../../../infrastructure/prisma/prisma.service';

import { ShippingConfigurationRepository } from '../../../../domain/repositories/shipping-configuration.repository';

import { ShippingConfiguration } from '../../../../domain/entities/shipping-configuration.entity';

import { ShippingConfigurationMapper } from '../mappers/shipping-configuration.mapper';

@Injectable()
export class PrismaShippingConfigurationRepository implements ShippingConfigurationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    id: string,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<ShippingConfiguration | null> {
    const record = await tx.shippingConfiguration.findUnique({
      where: { id },
    });

    return record ? ShippingConfigurationMapper.toDomain(record) : null;
  }

  async findActive(
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<ShippingConfiguration | null> {
    const record = await tx.shippingConfiguration.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    return record ? ShippingConfigurationMapper.toDomain(record) : null;
  }

  async findAll(): Promise<ShippingConfiguration[]> {
    const records = await this.prisma.shippingConfiguration.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return records.map((record) => ShippingConfigurationMapper.toDomain(record));
  }

  async countAll(tx: Prisma.TransactionClient = this.prisma): Promise<number> {
    return tx.shippingConfiguration.count();
  }

  async countActive(tx: Prisma.TransactionClient = this.prisma): Promise<number> {
    return tx.shippingConfiguration.count({
      where: { isActive: true },
    });
  }

  async create(
    configuration: ShippingConfiguration,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<ShippingConfiguration> {
    const created = await tx.shippingConfiguration.create({
      data: ShippingConfigurationMapper.toPersistence(configuration),
    });

    return ShippingConfigurationMapper.toDomain(created);
  }

  async update(
    configuration: ShippingConfiguration,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<ShippingConfiguration> {
    const updated = await tx.shippingConfiguration.update({
      where: { id: configuration.id },
      data: ShippingConfigurationMapper.toPersistence(configuration),
    });

    return ShippingConfigurationMapper.toDomain(updated);
  }

  async deactivateAll(tx: Prisma.TransactionClient = this.prisma): Promise<void> {
    await tx.shippingConfiguration.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.shippingConfiguration.delete({
      where: { id },
    });
  }
}

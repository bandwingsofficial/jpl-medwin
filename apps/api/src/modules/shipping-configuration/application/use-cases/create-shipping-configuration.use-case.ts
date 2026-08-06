import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { TOKENS } from '@/common/constants/tokens';

import { ShippingConfiguration } from '../../domain/entities/shipping-configuration.entity';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

@Injectable()
export class CreateShippingConfigurationUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.SHIPPING_CONFIGURATION_REPO)
    private readonly repository: ShippingConfigurationRepository,
  ) {}

  async execute(input: { shippingFee: number; freeShippingThreshold: number; isActive?: boolean }) {
    return this.prisma.$transaction(async (tx) => {
      const totalCount = await this.repository.countAll(tx);
      const shouldActivate = totalCount === 0 ? true : input.isActive !== false;

      if (shouldActivate) {
        await this.repository.deactivateAll(tx);
      }

      const configuration = new ShippingConfiguration(
        randomUUID(),
        input.shippingFee,
        input.freeShippingThreshold,
        shouldActivate,
      );

      const created = await this.repository.create(configuration, tx);

      return this.toResponse(created);
    });
  }

  private toResponse(configuration: ShippingConfiguration) {
    return {
      id: configuration.id,
      shippingFee: configuration.shippingFee,
      freeShippingThreshold: configuration.freeShippingThreshold,
      isActive: configuration.isActive,
      createdAt: configuration.createdAt,
      updatedAt: configuration.updatedAt,
    };
  }
}

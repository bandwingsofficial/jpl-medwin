import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

@Injectable()
export class ListShippingConfigurationsUseCase {
  constructor(
    @Inject(TOKENS.SHIPPING_CONFIGURATION_REPO)
    private readonly repository: ShippingConfigurationRepository,
  ) {}

  async execute() {
    const configurations = await this.repository.findAll();

    return {
      data: configurations.map((configuration) => ({
        id: configuration.id,
        shippingFee: configuration.shippingFee,
        freeShippingThreshold: configuration.freeShippingThreshold,
        isActive: configuration.isActive,
        createdAt: configuration.createdAt,
        updatedAt: configuration.updatedAt,
      })),
    };
  }
}

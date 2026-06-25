import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

import { ShippingConfigurationNotFoundException } from '../../domain/exceptions/shipping-configuration-not-found.exception';

@Injectable()
export class GetActiveShippingConfigurationUseCase {
  constructor(
    @Inject(TOKENS.SHIPPING_CONFIGURATION_REPO)
    private readonly repository: ShippingConfigurationRepository,
  ) {}

  async execute() {
    const configuration = await this.repository.findActive();

    if (!configuration) {
      throw new ShippingConfigurationNotFoundException();
    }

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

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

import { ShippingConfigurationNotFoundException } from '../../domain/exceptions/shipping-configuration-not-found.exception';

import { ActiveShippingConfigurationCannotBeDeletedException } from '../../domain/exceptions/active-shipping-configuration-cannot-be-deleted.exception';

@Injectable()
export class DeleteShippingConfigurationUseCase {
  constructor(
    @Inject(TOKENS.SHIPPING_CONFIGURATION_REPO)
    private readonly repository: ShippingConfigurationRepository,
  ) {}

  async execute(input: { id: string }) {
    const configuration = await this.repository.findById(input.id);

    if (!configuration) {
      throw new ShippingConfigurationNotFoundException({
        configurationId: input.id,
      });
    }

    if (configuration.isActive) {
      throw new ActiveShippingConfigurationCannotBeDeletedException({
        configurationId: input.id,
      });
    }

    await this.repository.delete(input.id);

    return {
      success: true,
      message: 'Shipping configuration deleted successfully',
    };
  }
}

import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';

import { TOKENS } from '@/common/constants/tokens';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

import { ShippingConfigurationNotFoundException } from '../../domain/exceptions/shipping-configuration-not-found.exception';

import { AtLeastOneActiveShippingConfigurationRequiredException } from '../../domain/exceptions/at-least-one-active-shipping-configuration-required.exception';

@Injectable()
export class UpdateShippingConfigurationUseCase {
  constructor(
    private readonly prisma: PrismaService,

    @Inject(TOKENS.SHIPPING_CONFIGURATION_REPO)
    private readonly repository: ShippingConfigurationRepository,
  ) {}

  async execute(input: {
    id: string;
    shippingFee?: number;
    freeShippingThreshold?: number;
    isActive?: boolean;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const configuration = await this.repository.findById(input.id, tx);

      if (!configuration) {
        throw new ShippingConfigurationNotFoundException({
          configurationId: input.id,
        });
      }

      if (input.isActive === false && configuration.isActive) {
        const activeCount = await this.repository.countActive(tx);

        if (activeCount <= 1) {
          throw new AtLeastOneActiveShippingConfigurationRequiredException({
            configurationId: input.id,
          });
        }
      }

      if (input.isActive === true) {
        await this.repository.deactivateAll(tx);
      }

      configuration.updateDetails({
        shippingFee: input.shippingFee,
        freeShippingThreshold: input.freeShippingThreshold,
        isActive: input.isActive,
      });

      const updated = await this.repository.update(configuration, tx);

      return {
        id: updated.id,
        shippingFee: updated.shippingFee,
        freeShippingThreshold: updated.freeShippingThreshold,
        isActive: updated.isActive,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    });
  }
}

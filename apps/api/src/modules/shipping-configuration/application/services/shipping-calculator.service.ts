import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { ShippingConfigurationRepository } from '../../domain/repositories/shipping-configuration.repository';

import { ShippingConfigurationNotFoundException } from '../../domain/exceptions/shipping-configuration-not-found.exception';

export type ShippingCalculationItem = {
  isOverweight?: boolean;
  weightKg?: number | null;
  quantity: number;
};

export type ShippingCalculationResult = {
  shipping: number;
  overweightDeliveryCharge: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  shippingFee: number;
  overweightChargePerKg: number;
};

@Injectable()
export class ShippingCalculatorService {
  constructor(
    @Inject(TOKENS.SHIPPING_CONFIGURATION_REPO)
    private readonly shippingConfigurationRepository: ShippingConfigurationRepository,
  ) {}

  async calculate(
    subtotal: number,
    options?: {
      shipping?: number;
      overweightDeliveryCharge?: number;
      items?: ShippingCalculationItem[];
    },
  ): Promise<ShippingCalculationResult> {
    const configuration = await this.shippingConfigurationRepository.findActive();

    if (!configuration) {
      throw new ShippingConfigurationNotFoundException();
    }

    const shipping = options?.shipping ?? configuration.calculateShipping(subtotal);
    const overweightDeliveryCharge =
      options?.overweightDeliveryCharge ??
      (options?.items ? configuration.calculateOverweightCharge(options.items) : 0);

    return {
      shipping,
      overweightDeliveryCharge,
      isFreeShipping: configuration.isFreeShipping(subtotal),
      freeShippingThreshold: configuration.freeShippingThreshold,
      shippingFee: configuration.shippingFee,
      overweightChargePerKg: configuration.overweightChargePerKg,
    };
  }
}

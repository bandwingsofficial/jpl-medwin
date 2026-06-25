import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { SavedAddressRepository } from '@/modules/saved-address/domain/repositories/saved-address.repository';

import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';

import { OrderShippingAddressNotFoundException } from '../../domain/exceptions/order-shipping-address-not-found.exception';
import { OrderBillingAddressNotFoundException } from '../../domain/exceptions/order-billing-address-not-found.exception';
import { OrderAddressAccessDeniedException } from '../../domain/exceptions/order-address-access-denied.exception';
import { OrderAddressInactiveException } from '../../domain/exceptions/order-address-inactive.exception';

export type ValidatedOrderAddresses = {
  shippingAddressId: string;
  billingAddressId: string;
  isBillingSameAsShipping: boolean;
  shippingAddress: SavedAddress;
  billingAddress: SavedAddress;
};

@Injectable()
export class OrderAddressValidationService {
  constructor(
    @Inject(TOKENS.SAVED_ADDRESS_REPO)
    private readonly savedAddressRepo: SavedAddressRepository,
  ) {}

  async validateForOrderCreation(input: {
    userId: string;
    shippingAddressId: string;
    billingAddressId?: string;
    isBillingSameAsShipping?: boolean;
  }): Promise<ValidatedOrderAddresses> {
    const isBillingSameAsShipping = input.isBillingSameAsShipping ?? true;

    const billingAddressId = isBillingSameAsShipping
      ? input.shippingAddressId
      : input.billingAddressId;

    if (!billingAddressId) {
      throw new OrderBillingAddressNotFoundException({
        userId: input.userId,
      });
    }

    const shippingAddress = await this.resolveOwnedActiveAddress({
      userId: input.userId,
      addressId: input.shippingAddressId,
      notFoundException: OrderShippingAddressNotFoundException,
    });

    const billingAddress =
      billingAddressId === input.shippingAddressId
        ? shippingAddress
        : await this.resolveOwnedActiveAddress({
            userId: input.userId,
            addressId: billingAddressId,
            notFoundException: OrderBillingAddressNotFoundException,
          });

    return {
      shippingAddressId: shippingAddress.id,
      billingAddressId: billingAddress.id,
      isBillingSameAsShipping,
      shippingAddress,
      billingAddress,
    };
  }

  private async resolveOwnedActiveAddress(params: {
    userId: string;
    addressId: string;
    notFoundException: new (details?: { addressId?: string; userId?: string }) => Error;
  }): Promise<SavedAddress> {
    const address = await this.savedAddressRepo.findByIdIncludingDeleted(params.addressId);

    if (!address) {
      throw new params.notFoundException({
        addressId: params.addressId,
        userId: params.userId,
      });
    }

    if (address.isDeleted()) {
      throw new OrderAddressInactiveException({
        addressId: address.id,
      });
    }

    if (address.userId !== params.userId) {
      throw new OrderAddressAccessDeniedException({
        addressId: address.id,
        userId: params.userId,
      });
    }

    return address;
  }
}

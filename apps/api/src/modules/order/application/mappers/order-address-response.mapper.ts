import { SavedAddress } from '@/modules/saved-address/domain/entities/saved-address.entity';

import { Order } from '../../domain/entities/order.entity';
import {
  OrderAddressSnapshotPayload,
  OrderAddressSnapshotStored,
} from '../../domain/types/order-address-snapshot.type';

import { OrderAddressSnapshotMapper } from './order-address-snapshot.mapper';

export type OrderAddressResponse = OrderAddressSnapshotPayload;

export class OrderAddressResponseMapper {
  static toAddressResponse(address?: SavedAddress | null): OrderAddressResponse | null {
    if (!address) {
      return null;
    }

    return OrderAddressSnapshotMapper.payloadFromSavedAddress(address);
  }

  static resolveFromSnapshot(
    snapshot?: OrderAddressSnapshotStored | null,
  ): OrderAddressResponse | null {
    const payload = OrderAddressSnapshotMapper.toPayload(snapshot);

    return payload ?? null;
  }

  static resolveShippingAddress(order: Order): OrderAddressResponse | null {
    const fromSnapshot = this.resolveFromSnapshot(order.shippingAddressSnapshot);

    if (fromSnapshot) {
      return fromSnapshot;
    }

    return this.toAddressResponse(order.shippingAddress);
  }

  static resolveBillingAddress(order: Order): OrderAddressResponse | null {
    const fromSnapshot = this.resolveFromSnapshot(order.billingAddressSnapshot);

    if (fromSnapshot) {
      return fromSnapshot;
    }

    return this.toAddressResponse(order.billingAddress);
  }

  static toOrderAddressFields(order: Order) {
    return {
      shippingAddressId: order.shippingAddressId ?? null,
      billingAddressId: order.billingAddressId ?? null,
      isBillingSameAsShipping: order.isBillingSameAsShipping,
      shippingAddress: this.resolveShippingAddress(order),
      billingAddress: this.resolveBillingAddress(order),
    };
  }
}

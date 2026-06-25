export const ORDER_ADDRESS_SNAPSHOT_VERSION = 1 as const;

export type OrderAddressSnapshotPayload = {
  id: string;
  fullName: string | null;
  phoneNumber: string;
  type: string;
  alias: string | null;
  addressLine1: string;
  addressLine2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
};

export type OrderAddressSnapshotRecord = {
  version: typeof ORDER_ADDRESS_SNAPSHOT_VERSION;
  capturedAt: string;
  address: OrderAddressSnapshotPayload;
};

/** Persisted JSON may be v1 wrapped or legacy flat payload. */
export type OrderAddressSnapshotStored = OrderAddressSnapshotRecord | OrderAddressSnapshotPayload;

/** @deprecated Use OrderAddressSnapshotPayload */
export type OrderAddressSnapshot = OrderAddressSnapshotPayload;

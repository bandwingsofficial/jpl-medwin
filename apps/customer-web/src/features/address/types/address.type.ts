export type AddressType =
  | "HOME"
  | "WORK"
  | "OTHER";

export interface SavedAddress {
  id: string;

  userId: string;

  type: AddressType;

  alias?: string | null;

  fullName: string;

  phoneNumber: string;

  addressLine1: string;

  addressLine2?: string | null;

  landmark?: string | null;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  latitude?: number | null;

  longitude?: number | null;

  isDefault: boolean;

  createdAt: string;

  updatedAt: string;
}

export interface AddressResponse {
  success: boolean;

  message: string;

  data: SavedAddress;
}

export interface AddressListResponse {
  success: boolean;

  message: string;

  data: SavedAddress[];
}

export interface CreateAddressPayload {
  type: AddressType;

  alias?: string;

  fullName: string;

  phoneNumber: string;

  addressLine1: string;

  addressLine2?: string;

  landmark?: string;

  city: string;

  state: string;

  country: string;

  postalCode: string;

  latitude?: number;

  longitude?: number;

  isDefault?: boolean;
}

export interface UpdateAddressPayload
  extends Partial<CreateAddressPayload> {
  id: string;
}
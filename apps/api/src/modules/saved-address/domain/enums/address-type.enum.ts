// src/modules/saved-address/domain/enums/address-type.enum.ts

export enum AddressType {
  HOME = 'HOME',

  WORK = 'WORK',

  OTHER = 'OTHER',
}

// 🔥 Useful helpers

export const ADDRESS_TYPE_VALUES = Object.values(AddressType);

export type AddressTypeType = (typeof ADDRESS_TYPE_VALUES)[number];

// Optional: type guard

export const isAddressType = (value: string): value is AddressType => {
  return ADDRESS_TYPE_VALUES.includes(value as AddressType);
};

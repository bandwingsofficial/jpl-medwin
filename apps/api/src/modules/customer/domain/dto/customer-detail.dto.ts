// src/modules/customer/domain/dto/customer-detail.dto.ts

import { AddressType, UserRole } from '@prisma/client';

export type CustomerProfileDto = {
  id: string;

  salutation?: string;

  firstName?: string;

  lastName?: string;

  name?: string;

  email?: string;

  phoneNumber?: string;

  customerType?: string;

  clinicHospitalName?: string;

  whatsappNumber?: string;

  gstNumber?: string;

  avatarUrl?: string;
};

export type CustomerIdentityDto = {
  id: string;

  type: string;

  value: string;

  isVerified: boolean;

  isTotpEnabled: boolean;
};

export type CustomerStatsDto = {
  totalOrders: number;

  totalSpent: number;
};

export type CustomerAddressDto = {
  id: string;

  type: AddressType;

  alias?: string;

  fullName?: string;

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

  isDefault: boolean;

  createdAt: Date;

  updatedAt: Date;
};

export type CustomerDetailDto = {
  id: string;

  role: UserRole;

  isActive: boolean;

  tokenVersion: number;

  profile: CustomerProfileDto | null;

  identities: CustomerIdentityDto[];

  stats: CustomerStatsDto;

  addresses: CustomerAddressDto[];

  createdAt: Date;

  updatedAt: Date;
};

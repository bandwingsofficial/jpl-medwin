// src/modules/customer/domain/dto/customer-detail.dto.ts

import { UserRole } from '@prisma/client';

export type CustomerProfileDto = {
  id: string;

  name?: string;

  email?: string;

  phoneNumber?: string;

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

export type CustomerDetailDto = {
  id: string;

  role: UserRole;

  isActive: boolean;

  tokenVersion: number;

  profile: CustomerProfileDto | null;

  identities: CustomerIdentityDto[];

  stats: CustomerStatsDto;

  createdAt: Date;

  updatedAt: Date;
};

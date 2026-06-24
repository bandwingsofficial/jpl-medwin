// src/modules/customer/domain/dto/customer-list.dto.ts

import { UserRole } from '@prisma/client';

export type CustomerListDto = {
  id: string;

  role: UserRole;

  name?: string;

  email?: string;

  phoneNumber?: string;

  avatarUrl?: string;

  isActive: boolean;

  totalOrders: number;

  totalSpent: number;

  createdAt: Date;
};
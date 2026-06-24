// src/modules/customer/domain/repositories/customer.repository.ts

import { CustomerDetailDto } from '../dto/customer-detail.dto';

import { CustomerListDto } from '../dto/customer-list.dto';

export abstract class CustomerRepository {
  // =======================
  // 🔍 GET CUSTOMER
  // =======================

  abstract findById(
    userId: string,
  ): Promise<CustomerDetailDto | null>;

  // =======================
  // 📋 GET CUSTOMERS
  // =======================

  abstract findMany(params?: {
    search?: string;

    page?: number;

    limit?: number;
  }): Promise<{
    customers: CustomerListDto[];

    total: number;

    page: number;

    limit: number;

    totalPages: number;
  }>;

  // =======================
  // ❌ DEACTIVATE CUSTOMER
  // =======================

  abstract deactivate(
    userId: string,
  ): Promise<void>;
}
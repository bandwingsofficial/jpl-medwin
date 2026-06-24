// src/modules/customer/application/use-cases/get-customers.use-case.ts

import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CustomerRepository } from '../../domain/repositories/customer.repository';

import { CustomerListDto } from '../../domain/dto/customer-list.dto';

@Injectable()
export class GetCustomersUseCase {
  constructor(
    @Inject(TOKENS.CUSTOMER_REPO)
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(input?: {
    search?: string;

    page?: number;

    limit?: number;
  }): Promise<{
    customers: CustomerListDto[];

    total: number;

    page: number;

    limit: number;

    totalPages: number;
  }> {
    console.log(
      '\n📋 [GET CUSTOMERS USE CASE]',
    );

    console.log(
      '➡️ Search:',
      input?.search,
    );

    console.log(
      '➡️ Page:',
      input?.page,
    );

    console.log(
      '➡️ Limit:',
      input?.limit,
    );

    // =======================
    // 📦 FETCH CUSTOMERS
    // =======================

    const result =
      await this.customerRepo.findMany(
        {
          search:
            input?.search,

          page:
            input?.page,

          limit:
            input?.limit,
        },
      );

    console.log(
      '✅ Customers fetched:',
      result.customers.length,
    );

    // =======================
    // ✅ RESPONSE
    // =======================

    return result;
  }
}
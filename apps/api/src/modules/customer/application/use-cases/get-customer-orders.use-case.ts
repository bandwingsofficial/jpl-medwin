// src/modules/customer/application/use-cases/get-customer-orders.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CustomerRepository } from '../../domain/repositories/customer.repository';

import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';

@Injectable()
export class GetCustomerOrdersUseCase {
  constructor(
    @Inject(TOKENS.CUSTOMER_REPO)
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(input: { userId: string }): Promise<{
    totalOrders: number;

    totalSpent: number;
  }> {
    console.log('\n📦 [GET CUSTOMER ORDERS USE CASE]');

    console.log('➡️ User ID:', input.userId);

    // =======================
    // 🔍 FIND CUSTOMER
    // =======================

    const customer = await this.customerRepo.findById(input.userId);

    console.log('➡️ Customer found:', !!customer);

    // =======================
    // ❌ NOT FOUND
    // =======================

    if (!customer) {
      throw new CustomerNotFoundException({
        userId: input.userId,
      });
    }

    // =======================
    // ✅ RESPONSE
    // =======================

    console.log('✅ Customer orders fetched');

    return {
      totalOrders: customer.stats.totalOrders,

      totalSpent: customer.stats.totalSpent,
    };
  }
}

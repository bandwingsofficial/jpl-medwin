// src/modules/customer/application/use-cases/get-customer-analytics.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CustomerRepository } from '../../domain/repositories/customer.repository';

@Injectable()
export class GetCustomerAnalyticsUseCase {
  constructor(
    @Inject(TOKENS.CUSTOMER_REPO)
    private readonly customerRepo: CustomerRepository,
  ) {}

  async execute(): Promise<{
    totalCustomers: number;

    activeCustomers: number;

    inactiveCustomers: number;

    totalRevenue: number;

    averageOrderValue: number;
  }> {
    console.log('\n📊 [CUSTOMER ANALYTICS USE CASE]');

    // =======================
    // 📦 FETCH CUSTOMERS
    // =======================

    const result = await this.customerRepo.findMany({
      page: 1,

      limit: 100000,
    });

    const customers = result.customers;

    // =======================
    // 📊 TOTAL CUSTOMERS
    // =======================

    const totalCustomers = customers.length;

    // =======================
    // ✅ ACTIVE CUSTOMERS
    // =======================

    const activeCustomers = customers.filter((customer) => customer.isActive).length;

    // =======================
    // 🚫 INACTIVE CUSTOMERS
    // =======================

    const inactiveCustomers = customers.filter((customer) => !customer.isActive).length;

    // =======================
    // 💰 TOTAL REVENUE
    // =======================

    const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);

    // =======================
    // 📦 TOTAL ORDERS
    // =======================

    const totalOrders = customers.reduce((sum, customer) => sum + customer.totalOrders, 0);

    // =======================
    // 📈 AVG ORDER VALUE
    // =======================

    const averageOrderValue = totalOrders > 0 ? Number((totalRevenue / totalOrders).toFixed(2)) : 0;

    console.log('✅ Analytics generated');

    // =======================
    // ✅ RESPONSE
    // =======================

    return {
      totalCustomers,

      activeCustomers,

      inactiveCustomers,

      totalRevenue,

      averageOrderValue,
    };
  }
}

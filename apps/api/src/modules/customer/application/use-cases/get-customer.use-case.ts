// src/modules/customer/application/use-cases/get-customer.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CustomerRepository } from '../../domain/repositories/customer.repository';

import { CustomerDetailDto } from '../../domain/dto/customer-detail.dto';

import { CustomerDomainService } from '../../domain/services/customer-domain.service';

import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject(TOKENS.CUSTOMER_REPO)
    private readonly customerRepo: CustomerRepository,

    private readonly domainService: CustomerDomainService,
  ) {}

  async execute(input: { userId: string }): Promise<CustomerDetailDto> {
    console.log('\n👤 [GET CUSTOMER USE CASE]');

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
    // 🧠 ACTIVE VALIDATION
    // =======================

    this.domainService.ensureCustomerActive({
      isActive: customer.isActive,
    });

    // =======================
    // ✅ RESPONSE
    // =======================

    console.log('✅ CUSTOMER FETCHED');

    return customer;
  }
}

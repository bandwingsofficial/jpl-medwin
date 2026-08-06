// src/modules/customer/application/use-cases/deactivate-customer.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CustomerRepository } from '../../domain/repositories/customer.repository';

import { CustomerNotFoundException } from '../../domain/exceptions/customer-not-found.exception';

import { CustomerDomainService } from '../../domain/services/customer-domain.service';

@Injectable()
export class DeactivateCustomerUseCase {
  constructor(
    @Inject(TOKENS.CUSTOMER_REPO)
    private readonly customerRepo: CustomerRepository,

    private readonly domainService: CustomerDomainService,
  ) {}

  async execute(input: { userId: string }): Promise<void> {
    console.log('\n❌ [DEACTIVATE CUSTOMER USE CASE]');

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
    // 🧠 VALIDATE ACTIVE
    // =======================

    this.domainService.ensureCustomerActive({
      isActive: customer.isActive,
    });

    // =======================
    // ❌ DEACTIVATE
    // =======================

    await this.customerRepo.deactivate(input.userId);

    console.log('✅ CUSTOMER DEACTIVATED');
  }
}

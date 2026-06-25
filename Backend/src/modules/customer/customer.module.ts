// src/modules/customer/customer.module.ts

import { Module } from '@nestjs/common';

import { AuthModule } from '@/modules/auth/auth.module';

// =======================
// CONTROLLERS
// =======================

import { AdminCustomerController } from './presentation/controllers/admin-customer.controller';

// =======================
// USE CASES
// =======================

import { GetCustomerUseCase } from './application/use-cases/get-customer.use-case';

import { GetCustomersUseCase } from './application/use-cases/get-customers.use-case';

import { DeactivateCustomerUseCase } from './application/use-cases/deactivate-customer.use-case';

import { GetCustomerOrdersUseCase } from './application/use-cases/get-customer-orders.use-case';

import { GetCustomerAnalyticsUseCase } from './application/use-cases/get-customer-analytics.use-case';

// =======================
// DOMAIN SERVICES
// =======================

import { CustomerDomainService } from './domain/services/customer-domain.service';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// REPOSITORIES
// =======================

import { PrismaCustomerRepository } from './infrastructure/repositories/prisma-customer.repository';

// =======================
// MODULES
// =======================

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule],

  controllers: [AdminCustomerController],

  providers: [
    // =======================
    // USE CASES
    // =======================

    GetCustomerUseCase,

    GetCustomersUseCase,

    DeactivateCustomerUseCase,

    GetCustomerOrdersUseCase,

    GetCustomerAnalyticsUseCase,

    // =======================
    // DOMAIN SERVICES
    // =======================

    CustomerDomainService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.CUSTOMER_REPO,

      useClass: PrismaCustomerRepository,
    },
  ],

  exports: [TOKENS.CUSTOMER_REPO],
})
export class CustomerModule {}

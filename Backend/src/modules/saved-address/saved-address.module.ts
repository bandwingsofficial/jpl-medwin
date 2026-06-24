// src/modules/saved-address/saved-address.module.ts

import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { AuthModule } from '@/modules/auth/auth.module';

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLER
// =======================

import { SavedAddressController } from './presentation/controllers/saved-address.controller';

// =======================
// USE CASES
// =======================

import { CreateSavedAddressUseCase } from './application/use-cases/create-saved-address.use-case';

import { UpdateSavedAddressUseCase } from './application/use-cases/update-saved-address.use-case';

import { DeleteSavedAddressUseCase } from './application/use-cases/delete-saved-address.use-case';

import { GetSavedAddressesUseCase } from './application/use-cases/get-saved-addresses.use-case';

// =======================
// APPLICATION SERVICES
// =======================

import { CreateSavedAddressService } from './application/services/create-saved-address.service';

import { UpdateSavedAddressService } from './application/services/update-saved-address.service';

import { SavedAddressDefaultService } from './application/services/saved-address-default.service';

// =======================
// DOMAIN SERVICES
// =======================

import { SavedAddressDomainService } from './domain/services/saved-address-domain.service';

// =======================
// REPOSITORY
// =======================

import { PrismaSavedAddressRepository } from './infrastructure/persistence/prisma/repositories/prisma-saved-address.repository';

@Module({
  imports: [PrismaModule, AuthModule],

  controllers: [SavedAddressController],

  providers: [
    // =======================
    // USE CASES
    // =======================

    CreateSavedAddressUseCase,

    UpdateSavedAddressUseCase,

    DeleteSavedAddressUseCase,

    GetSavedAddressesUseCase,

    // =======================
    // APPLICATION SERVICES
    // =======================

    CreateSavedAddressService,

    UpdateSavedAddressService,

    SavedAddressDefaultService,

    // =======================
    // DOMAIN SERVICES
    // =======================

    SavedAddressDomainService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.SAVED_ADDRESS_REPO,

      useClass: PrismaSavedAddressRepository,
    },
  ],

  exports: [TOKENS.SAVED_ADDRESS_REPO],
})
export class SavedAddressModule {}

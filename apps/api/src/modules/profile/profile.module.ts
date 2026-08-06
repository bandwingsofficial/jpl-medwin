// src/modules/profile/profile.module.ts

import { Module } from '@nestjs/common';

import { UploadModule } from '@/modules/upload/upload.module';

import { AuthModule } from '@/modules/auth/auth.module';

// =======================
// CONTROLLERS
// =======================

import { ProfileController } from './presentation/controllers/profile.controller';

// =======================
// USE CASES
// =======================

import { CreateProfileUseCase } from './application/use-cases/create-profile.use-case';

import { UpdateProfileUseCase } from './application/use-cases/update-profile.use-case';

import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';

import { DeleteProfileUseCase } from './application/use-cases/delete-profile.use-case';

// =======================
// DOMAIN SERVICES
// =======================

import { ProfileDomainService } from './domain/services/profile-domain.service';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// REPOSITORIES
// =======================

import { PrismaProfileRepository } from './infrastructure/persistence/prisma/repositories/prisma-profile.repository';

// =======================
// MODULES
// =======================

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, UploadModule],

  controllers: [ProfileController],

  providers: [
    // =======================
    // USE CASES
    // =======================

    CreateProfileUseCase,

    UpdateProfileUseCase,

    GetProfileUseCase,
    DeleteProfileUseCase,

    // =======================
    // DOMAIN SERVICES
    // =======================

    ProfileDomainService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.PROFILE_REPO,
      useClass: PrismaProfileRepository,
    },
  ],

  exports: [TOKENS.PROFILE_REPO],
})
export class ProfileModule {}

// src/modules/banner/banner.module.ts

import { Module } from '@nestjs/common';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { AuthModule } from '@/modules/auth/auth.module';

import { UploadModule } from '@/modules/upload/upload.module';

import { ProductModule } from '../product/product.module';

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLERS
// =======================

import { AdminBannerController } from './presentation/controllers/admin-banner.controller';

import { PublicBannerController } from './presentation/controllers/public-banner.controller';

// =======================
// USE CASES
// =======================

import { CreateBannerUseCase } from './application/use-cases/create-banner.use-case';

import { UpdateBannerUseCase } from './application/use-cases/update-banner.use-case';

import { GetBannerUseCase } from './application/use-cases/get-banner.use-case';

import { ListBannersUseCase } from './application/use-cases/list-banners.use-case';

import { ActivateBannerUseCase } from './application/use-cases/activate-banner.use-case';

import { DeactivateBannerUseCase } from './application/use-cases/deactivate-banner.use-case';

import { DeleteBannerUseCase } from './application/use-cases/delete-banner.use-case';

import { RestoreBannerUseCase } from './application/use-cases/restore-banner.use-case';

import { UpdateBannerImageUseCase } from './application/use-cases/update-banner-image.use-case';

import { RestoreBannerImageUseCase } from './application/use-cases/restore-banner-image.use-case';

import { DeleteBannerImageUseCase } from './application/use-cases/delete-banner-image.use-case';
import { AddBannerImageUseCase } from './application/use-cases/add-banner-image.use-case';

// =======================
// REPOSITORIES
// =======================

import { PrismaBannerRepository } from './infrastructure/persistence/prisma/repositories/prisma-banner.repository';

import { PrismaBannerImageRepository } from './infrastructure/persistence/prisma/repositories/prisma-banner-image.repository';

@Module({
  imports: [PrismaModule, AuthModule, UploadModule, ProductModule],

  controllers: [AdminBannerController, PublicBannerController],

  providers: [
    // =======================
    // BANNER
    // =======================

    CreateBannerUseCase,

    UpdateBannerUseCase,

    GetBannerUseCase,

    ListBannersUseCase,

    ActivateBannerUseCase,

    DeactivateBannerUseCase,

    DeleteBannerUseCase,

    RestoreBannerUseCase,

    // =======================
    // BANNER IMAGE
    // =======================

    UpdateBannerImageUseCase,

    RestoreBannerImageUseCase,

    DeleteBannerImageUseCase,

    AddBannerImageUseCase,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.BANNER_REPO,
      useClass: PrismaBannerRepository,
    },

    {
      provide: TOKENS.BANNER_IMAGE_REPO,
      useClass: PrismaBannerImageRepository,
    },
  ],

  exports: [TOKENS.BANNER_REPO, TOKENS.BANNER_IMAGE_REPO],
})
export class BannerModule {}

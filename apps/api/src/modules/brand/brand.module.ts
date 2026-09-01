import { Module } from '@nestjs/common';

import { UploadModule } from '@/modules/upload/upload.module';

import { AdminBrandController } from '@/modules/brand/presentation/controllers/admin-brand.controller';
import { PublicBrandController } from '@/modules/brand/presentation/controllers/public-brand.controller';
import { BrandS3ImageResolverService } from '@/modules/brand/application/services/brand-s3-image-resolver.service';
// =======================
// USE CASES
// =======================

import { CreateBrandUseCase } from '@/modules/brand/application/use-cases/create-brand.use-case';
import { UpdateBrandUseCase } from '@/modules/brand/application/use-cases/update-brand.use-case';
import { DeleteBrandUseCase } from '@/modules/brand/application/use-cases/delete-brand.use-case';
import { GetBrandsUseCase } from '@/modules/brand/application/use-cases/get-brands.use-case';
import { UpdateBrandStatusUseCase } from '@/modules/brand/application/use-cases/update-brand-status.use-case';

// =======================
// DOMAIN SERVICES
// =======================

import { BrandDomainService } from '@/modules/brand/domain/services/brand-domain.service';
import { BrandSkuPrefixService } from '@/modules/brand/domain/services/brand-sku-prefix.service';

// =======================
// PORTS (TOKENS)
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// ADAPTERS (PRISMA REPO)
// =======================

import { PrismaBrandRepository } from '@/modules/brand/infrastructure/persistence/prisma/repositories/prisma-brand.repository';

// =======================
// MODULES
// =======================

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, UploadModule],

  controllers: [AdminBrandController, PublicBrandController],

  providers: [
    // =======================
    // USE CASES
    // =======================

    CreateBrandUseCase,
    UpdateBrandUseCase,
    DeleteBrandUseCase,
    GetBrandsUseCase,
    UpdateBrandStatusUseCase,
    

    // =======================
    // DOMAIN SERVICES
    // =======================

    BrandDomainService,
    BrandSkuPrefixService,
    BrandS3ImageResolverService,

    // =======================
    // REPOSITORY
    // =======================

    {
      provide: TOKENS.BRAND_REPO,
      useClass: PrismaBrandRepository,
    },
  ],

  exports: [
    // Repository
    TOKENS.BRAND_REPO,

    // Services
    BrandDomainService,
    BrandSkuPrefixService,

    // Create Use Case (for Product Import)
    CreateBrandUseCase,
  ],
})
export class BrandModule {}
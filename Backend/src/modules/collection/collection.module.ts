// src/modules/collection/collection.module.ts

import { Module } from '@nestjs/common';

import { UploadModule } from '@/modules/upload/upload.module';

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';

import { AuthModule } from '@/modules/auth/auth.module';

import { TOKENS } from '@/common/constants/tokens';

// =======================
// CONTROLLERS
// =======================

import { AdminCollectionController } from './presentation/controllers/admin-collection.controller';
import { PublicCollectionController } from './presentation/controllers/public-collection.controller';

// =======================
// USE CASES
// =======================

import { CreateCollectionUseCase } from './application/use-cases/create-collection.use-case';
import { UpdateCollectionUseCase } from './application/use-cases/update-collection.use-case';
import { DeleteCollectionUseCase } from './application/use-cases/delete-collection.use-case';
import { RestoreCollectionUseCase } from './application/use-cases/restore-collection.use-case';

import { ActivateCollectionUseCase } from './application/use-cases/activate-collection.use-case';
import { DeactivateCollectionUseCase } from './application/use-cases/deactivate-collection.use-case';

import { GetCollectionUseCase } from './application/use-cases/get-collection.use-case';
import { GetCollectionsUseCase } from './application/use-cases/get-collections.use-case';

import { AddProductToCollectionUseCase } from './application/use-cases/add-product-to-collection.use-case';
import { RemoveProductFromCollectionUseCase } from './application/use-cases/remove-product-from-collection.use-case';

// =======================
// DOMAIN SERVICES
// =======================

import { CollectionDomainService } from './domain/services/collection-domain.service';
import { CollectionProductDomainService } from './domain/services/collection-product-domain.service';

// =======================
// REPOSITORIES
// =======================

import { PrismaCollectionRepository } from './infrastructure/persistence/prisma/repositories/prisma-collection.repository';
import { PrismaCollectionProductRepository } from './infrastructure/persistence/prisma/repositories/prisma-collection-product.repository';

import { ProductModule } from '@/modules/product/product.module';

@Module({
  imports: [PrismaModule, AuthModule, UploadModule, ProductModule],

  controllers: [AdminCollectionController, PublicCollectionController],

  providers: [
    // =======================
    // USE CASES
    // =======================

    CreateCollectionUseCase,
    UpdateCollectionUseCase,
    DeleteCollectionUseCase,
    RestoreCollectionUseCase,

    ActivateCollectionUseCase,
    DeactivateCollectionUseCase,

    GetCollectionUseCase,
    GetCollectionsUseCase,

    AddProductToCollectionUseCase,
    RemoveProductFromCollectionUseCase,

    // =======================
    // DOMAIN SERVICES
    // =======================

    CollectionDomainService,
    CollectionProductDomainService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.COLLECTION_REPO,
      useClass: PrismaCollectionRepository,
    },

    {
      provide: TOKENS.COLLECTION_PRODUCT_REPO,
      useClass: PrismaCollectionProductRepository,
    },
  ],

  exports: [TOKENS.COLLECTION_REPO, TOKENS.COLLECTION_PRODUCT_REPO],
})
export class CollectionModule {}

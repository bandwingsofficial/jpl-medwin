import { Module } from '@nestjs/common';

import { UploadModule } from '@/modules/upload/upload.module';

import { AdminCategoryController } from '@/modules/category/presentation/controllers/category.controller';
import { PublicCategoryController } from '@/modules/category/presentation/controllers/public-catagory.controller';

// =======================
// USE CASES
// =======================

import { CreateCategoryUseCase } from '@/modules/category/application/usecases/category/create-category.usecase';
import { CreateSubCategoryUseCase } from '@/modules/category/application/usecases/sub-category/create-sub-category.usecase';
import { CreateMiniCategoryUseCase } from '@/modules/category/application/usecases/mini-category/create-mini-category.usecase';
import { GetCategoryTreeUseCase } from '@/modules/category/application/usecases/get-category-tree.usecase';
import { UpdateCategoryUseCase } from '@/modules/category/application/usecases/category/update-category.usecase';
import { UpdateSubCategoryUseCase } from '@/modules/category/application/usecases/sub-category/update-sub-category.usecase';
import { UpdateMiniCategoryUseCase } from '@/modules/category/application/usecases/mini-category/update-mini-category.usecase';
import { DeleteMiniCategoryUseCase } from './application/usecases/mini-category/delete-mini-category.usecase';
import { DeleteSubCategoryUseCase } from './application/usecases/sub-category/delete-sub-category.usecase';
import { DeleteCategoryUseCase } from './application/usecases/category/delete-category.usecase';
import { GetCategoriesUseCase } from './application/usecases/category/get-categories.usecase';
import { GetSubCategoriesUseCase } from './application/usecases/sub-category/get-sub-categories.usecase';
import { GetMiniCategoriesUseCase } from './application/usecases/mini-category/get-mini-categories.usecase';
import { UpdateCategoryStatusUseCase } from './application/usecases/category/update-category-status.usecase';
import { UpdateMiniCategoryStatusUseCase } from './application/usecases/mini-category/update-mini-category-status.usecase';
import { UpdateSubCategoryStatusUseCase } from './application/usecases/sub-category/update-sub-category-status.usecase';

// =======================
// DOMAIN SERVICES

// =======================
// DOMAIN SERVICES
// =======================

import { CategoryDomainService } from '@/modules/category/domain/services/category.domain-service';

// =======================
// PORTS (TOKENS)
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// ADAPTERS (PRISMA REPOS)
// =======================

import { PrismaCategoryRepository } from '../category/infrastructure/persistence/prisma/repositories/category.repository';
import { PrismaSubCategoryRepository } from '../category/infrastructure/persistence/prisma/repositories/sub-category.repository';
import { PrismaMiniCategoryRepository } from '../category/infrastructure/persistence/prisma/repositories/mini-category.repository';

// =======================
// MODULES
// =======================

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, UploadModule],

  controllers: [AdminCategoryController, PublicCategoryController],

  providers: [
    // =======================
    // USE CASES
    // =======================
    CreateCategoryUseCase,
    CreateSubCategoryUseCase,
    CreateMiniCategoryUseCase,
    GetCategoryTreeUseCase,
    UpdateCategoryUseCase,
    UpdateSubCategoryUseCase,
    UpdateMiniCategoryUseCase,
    DeleteCategoryUseCase,
    DeleteSubCategoryUseCase,
    DeleteMiniCategoryUseCase,
    GetCategoriesUseCase,
    GetSubCategoriesUseCase,
    GetMiniCategoriesUseCase,
    UpdateCategoryStatusUseCase,
    UpdateSubCategoryStatusUseCase,
    UpdateMiniCategoryStatusUseCase,

    // =======================
    // DOMAIN SERVICES
    // =======================
    CategoryDomainService,

    // =======================
    // REPOSITORIES
    // =======================
    {
      provide: TOKENS.CATEGORY_REPO,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: TOKENS.SUB_CATEGORY_REPO,
      useClass: PrismaSubCategoryRepository,
    },
    {
      provide: TOKENS.MINI_CATEGORY_REPO,
      useClass: PrismaMiniCategoryRepository,
    },
  ],

  // 🔥🔥🔥 THIS IS THE FIX
  exports: [TOKENS.CATEGORY_REPO, TOKENS.SUB_CATEGORY_REPO, TOKENS.MINI_CATEGORY_REPO],
})
export class CategoryModule {}

import { Module, forwardRef } from '@nestjs/common';

// =======================
// CONTROLLERS
// =======================

import { AdminProductController } from './presentation/controllers/admin-product.controllers';
import { PublicProductController } from './presentation/controllers/public-product.controllers';
import { PublicVariantController } from './presentation/controllers/public-variant.controller';

// =======================
// MODULES
// =======================

import { PrismaModule } from '../../infrastructure/prisma/prisma.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoryModule } from '@/modules/category/category.module';
import { BrandModule } from '@/modules/brand/brand.module';
import { UploadModule } from '../upload/upload.module';
import { CartModule } from '@/modules/cart/cart.module';

// =======================
// TOKENS
// =======================

import { TOKENS } from '@/common/constants/tokens';

// =======================
// PRODUCT USE CASES
// =======================

import { CreateProductUseCase } from './application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from './application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from './application/use-cases/delete-product.use-case';
import { GetProductsUseCase } from './application/use-cases/get-products.use-case';
import { GetProductDetailUseCase } from './application/use-cases/get-product-detail.use-case';
import { UpdateProductStatusUseCase } from './application/use-cases/update-product-status.use-case';

import { ImportProductsUseCase } from './application/use-cases/import-products.use-case';
import { ExportProductsUseCase } from './application/use-cases/export-products.use-case';
import { PreviewProductImportUseCase } from './application/use-cases/preview-product-import.use-case';
import { PublicGetProductsUseCase } from './application/use-cases/public-get-products.use-case';

// =======================
// VARIANT USE CASES
// =======================

import { GetVariantsUseCase } from './application/use-cases/get-variants.use-case';
import { UpdateVariantStatusUseCase } from './application/use-cases/update-variant-status.use-case';
import { RestoreVariantUseCase } from './application/use-cases/restore-variant.use-case';

// =======================
// APPLICATION SERVICES
// =======================

import { ProductValidationService } from './application/services/product-validation.service';
import { ProductSlugService } from './application/services/product-slug.service';
import { ProductBuilderService } from './application/services/product-builder.service';
import { ProductImageService } from './application/services/product-image.service';
import { VariantCreatorService } from './application/services/variant-creator.service';
import { ProductPriceService } from './application/services/product-price.service';

import { UpdateProductBuilderService } from './application/services/update-product-builder.service';
import { VariantSyncService } from './application/services/variant-sync.service';
import { VariantImageService } from './application/services/variant-image.service';
import { ProductGalleryService } from './application/services/product-gallery.service';

// =======================
// IMPORT SERVICES
// =======================

import { ProductImportMapperService } from './application/services/product-import.mapper';
import { ProductImportValidatorService } from './application/services/product-import.validator';
import { ProductImportResolverService } from './application/services/product-import-resolver.service';
import { ProductS3ImageResolverService } from './application/services/product-s3-image-resolver.service';

import { ProductImportParserService } from './application/services/product-import-parser.service';
import { ProductFileMapperService } from './application/services/product-file-mapper.service';
import { ProductUploadService } from './application/services/product-upload.service';

// =======================
// EXPORT SERVICES
// =======================

import { ProductExportBuilderService } from './application/services/product-export-builder.service';
import { ProductExportExcelService } from './application/services/product-export-excel.service';
import { ProductExportFlattenerService } from './application/services/product-export-flattener.service';
import { ProductExportMapperService } from './application/services/product-export.mapper.service';

// =======================
// DOMAIN SERVICES
// =======================

import { ProductDomainService } from './domain/services/product-domain.service';

// =======================
// REPOSITORIES
// =======================

import { PrismaProductRepository } from './infrastructure/persistence/prisma/repositories/prisma-product.repository';
import { PrismaVariantRepository } from './infrastructure/persistence/prisma/repositories/prisma-variant.repository';
import { PrismaProductImageRepository } from './infrastructure/persistence/prisma/repositories/prisma-product-image.repository';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    UploadModule,
    forwardRef(() => CartModule),
  ],

  controllers: [AdminProductController, PublicProductController, PublicVariantController],

  providers: [
    // =======================
    // PRODUCT USE CASES
    // =======================

    CreateProductUseCase,
    UpdateProductUseCase,
    DeleteProductUseCase,
    GetProductsUseCase,
    GetProductDetailUseCase,
    UpdateProductStatusUseCase,

    ImportProductsUseCase,
    ExportProductsUseCase,
    PreviewProductImportUseCase,
    PublicGetProductsUseCase,

    // =======================
    // VARIANT USE CASES
    // =======================

    GetVariantsUseCase,
    UpdateVariantStatusUseCase,
    RestoreVariantUseCase,

    // =======================
    // APPLICATION SERVICES
    // =======================

    ProductValidationService,
    ProductSlugService,
    ProductBuilderService,
    ProductImageService,
    VariantCreatorService,
    ProductPriceService,

    UpdateProductBuilderService,
    VariantSyncService,
    VariantImageService,
    ProductGalleryService,

    // =======================
    // IMPORT SERVICES
    // =======================

    ProductImportMapperService,
    ProductImportValidatorService,
    ProductImportResolverService,
    ProductS3ImageResolverService,

    ProductImportParserService,
    ProductFileMapperService,
    ProductUploadService,

    ProductExportMapperService,
    ProductExportFlattenerService,
    ProductExportExcelService,
    ProductExportBuilderService,

    // =======================
    // DOMAIN SERVICES
    // =======================

    ProductDomainService,

    // =======================
    // REPOSITORIES
    // =======================

    {
      provide: TOKENS.PRODUCT_REPO,
      useClass: PrismaProductRepository,
    },

    {
      provide: TOKENS.VARIANT_REPO,
      useClass: PrismaVariantRepository,
    },

    {
      provide: TOKENS.PRODUCT_IMAGE_REPO,
      useClass: PrismaProductImageRepository,
    },
  ],

  exports: [TOKENS.PRODUCT_REPO, TOKENS.VARIANT_REPO, TOKENS.PRODUCT_IMAGE_REPO],
})
export class ProductModule {}

// src/modules/collection/presentation/controllers/admin-collection.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';

import { RolesGuard } from '@/modules/auth/presentation/guards/role.guard';

import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';

import { UserRole } from '@/domain/enums/user-role.enum';

import { multerConfig } from '@/modules/upload/infrastructure/multer.config';

import { UploadImageUseCase } from '@/modules/upload/application/upload-image.usecase';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionStatus } from '../../domain/enums/collection-status.enum';

import { CreateCollectionUseCase } from '../../application/use-cases/create-collection.use-case';

import { UpdateCollectionUseCase } from '../../application/use-cases/update-collection.use-case';

import { DeleteCollectionUseCase } from '../../application/use-cases/delete-collection.use-case';

import { RestoreCollectionUseCase } from '../../application/use-cases/restore-collection.use-case';

import { ActivateCollectionUseCase } from '../../application/use-cases/activate-collection.use-case';

import { DeactivateCollectionUseCase } from '../../application/use-cases/deactivate-collection.use-case';

import { GetCollectionsUseCase } from '../../application/use-cases/get-collections.use-case';

import { GetCollectionUseCase } from '../../application/use-cases/get-collection.use-case';


import { CreateCollectionDto } from '../../presentation/dto/create-collection.dto';

import { UpdateCollectionDto } from '../../presentation/dto/update-collection.dto';
import { AddProductToCollectionDto } from '../../presentation/dto/assign-products-to-collection.dto';

import { RemoveProductFromCollectionUseCase } from '../../application/use-cases/remove-product-from-collection.use-case';
import { AddProductToCollectionUseCase } from '../../application/use-cases/add-product-to-collection.use-case';

@Controller('admin/collections')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCollectionController {
  constructor(
    private readonly createCollectionUseCase: CreateCollectionUseCase,

    private readonly updateCollectionUseCase: UpdateCollectionUseCase,

    private readonly deleteCollectionUseCase: DeleteCollectionUseCase,

    private readonly restoreCollectionUseCase: RestoreCollectionUseCase,

    private readonly activateCollectionUseCase: ActivateCollectionUseCase,

    private readonly deactivateCollectionUseCase: DeactivateCollectionUseCase,

    private readonly getCollectionsUseCase: GetCollectionsUseCase,

    private readonly getCollectionUseCase: GetCollectionUseCase,
    private readonly addProductToCollectionUseCase: AddProductToCollectionUseCase,

private readonly removeProductFromCollectionUseCase: RemoveProductFromCollectionUseCase,
    

    private readonly uploadUseCase: UploadImageUseCase,

    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,
  ) {}

  // =======================
  // ✨ CREATE
  // =======================

  @Post()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async createCollection(
    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    dto: CreateCollectionDto,
  ) {
    let imageUrl = dto.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'collections');

      imageUrl = upload.url;
    }

    return this.createCollectionUseCase.execute({
      ...dto,
      imageUrl,
    });
  }

  // =======================
  // 🔄 UPDATE
  // =======================

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async updateCollection(
    @Param('id')
    id: string,

    @UploadedFile()
    file: Express.Multer.File,

    @Body()
    dto: UpdateCollectionDto,
  ) {
    const existing = await this.collectionRepo.findById(id);

    if (!existing) {
      throw new Error('Collection not found');
    }

    let imageUrl = existing.imageUrl;

    if (file) {
      const upload = await this.uploadUseCase.execute(file, 'collections');

      imageUrl = upload.url;
    }

    const collection =
  await this.updateCollectionUseCase.execute({
    collectionId: id,

    ...dto,

    imageUrl,
  });

    if (file && existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return collection;
  }

  // =======================
  // 📋 LIST
  // =======================

  @Get()
  async getCollections(
    @Query('page')
    page?: number,

    @Query('limit')
    limit?: number,

    @Query('status')
    status?: CollectionStatus,
  ) {
    return this.getCollectionsUseCase.execute({
      page,
      limit,
      status,
    });
  }

  // =======================
  // 🔍 DETAILS
  // =======================

  @Get(':id')
  async getCollection(
    @Param('id')
    id: string,

    @Query('page')
    page?: number,

    @Query('limit')
    limit?: number,
  ) {
    return this.getCollectionUseCase.execute({
      collectionId: id,

      page,

      limit,
    });
  }

  // =======================
  // 🟢 ACTIVATE
  // =======================

  @Patch(':id/activate')
  async activate(
    @Param('id')
    id: string,
  ) {
    return this.activateCollectionUseCase.execute({
      collectionId: id,
    });
  }

  // =======================
  // 🔴 DEACTIVATE
  // =======================

  @Patch(':id/deactivate')
  async deactivate(
    @Param('id')
    id: string,
  ) {
    return this.deactivateCollectionUseCase.execute({
      collectionId: id,
    });
  }

  // =======================
  // ♻️ RESTORE
  // =======================

  @Patch(':id/restore')
  async restore(
    @Param('id')
    id: string,
  ) {
    return this.restoreCollectionUseCase.execute({
      collectionId: id,
    });
  }

  // =======================
  // 🗑 DELETE
  // =======================

  @Delete(':id')
  async deleteCollection(
    @Param('id')
    id: string,
  ) {
    const existing = await this.collectionRepo.findById(id);

    if (!existing) {
      throw new Error('Collection not found');
    }

    await this.deleteCollectionUseCase.execute({
      collectionId: id,
    });

    if (existing.imageUrl) {
      await this.uploadUseCase.delete(existing.imageUrl);
    }

    return {
      success: true,
      message: 'Collection deleted successfully',
    };
  }

  // =======================
// ➕ ADD PRODUCT
// =======================

@Post(':id/products')
async addProduct(
  @Param('id') collectionId: string,

  @Body()
  dto: AddProductToCollectionDto,
) {
  return this.addProductToCollectionUseCase.execute({
    collectionId,

    productId: dto.productId,
  });
}

// =======================
// ❌ REMOVE PRODUCT
// =======================

@Delete(':id/products/:productId')
async removeProduct(
  @Param('id') collectionId: string,

  @Param('productId') productId: string,
) {
  await this.removeProductFromCollectionUseCase.execute({
    collectionId,

    productId,
  });

  return {
    success: true,

    message:
      'Product removed from collection',
  };
}
}

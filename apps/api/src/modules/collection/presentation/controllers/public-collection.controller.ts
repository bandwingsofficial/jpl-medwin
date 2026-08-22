// src/modules/collection/presentation/controllers/public-collection.controller.ts

import { Controller, Get, Param, Query } from '@nestjs/common';

import { CollectionStatus } from '../../domain/enums/collection-status.enum';

import { GetCollectionUseCase } from '../../application/use-cases/get-collection.use-case';

import { GetCollectionsUseCase } from '../../application/use-cases/get-collections.use-case';

@Controller('collections')
export class PublicCollectionController {
  constructor(
    private readonly getCollectionsUseCase: GetCollectionsUseCase,

    private readonly getCollectionUseCase: GetCollectionUseCase,
  ) {}

  // =======================
  // 📚 LIST COLLECTIONS
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
  // 🔍 COLLECTION DETAILS
  // =======================

  @Get(':slug')
  async getCollection(
    @Param('slug')
   slug: string,

    @Query('page')
    page?: number,

    @Query('limit')
    limit?: number,
  ) {
    return this.getCollectionUseCase.execute({
      slug,

      page,

      limit,
    });
  }
}

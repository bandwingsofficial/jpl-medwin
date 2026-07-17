// src/modules/collection/application/use-cases/delete-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

@Injectable()
export class DeleteCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    private readonly domainService: CollectionDomainService,
  ) {}

  async execute(input: { collectionId: string }): Promise<void> {
    // =======================
    // 🔍 COLLECTION
    // =======================

    const collection = this.domainService.ensureExists({
      collection: await this.collectionRepo.findById(input.collectionId),

      collectionId: input.collectionId,
    });

    // =======================
    // ❌ DELETE
    // =======================

    collection.softDelete();

    // =======================
    // 💾 SAVE
    // =======================

    await this.collectionRepo.update(collection);
  }
}

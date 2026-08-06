// src/modules/collection/application/use-cases/restore-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

@Injectable()
export class RestoreCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    private readonly domainService: CollectionDomainService,
  ) {}

  async execute(input: { collectionId: string }) {
    // =======================
    // 🔍 COLLECTION
    // =======================

    const collection = this.domainService.ensureExists({
      collection: await this.collectionRepo.findByIdIncludingDeleted(input.collectionId),

      collectionId: input.collectionId,
    });

    // =======================
    // ♻️ RESTORE
    // =======================

    collection.restore();

    // =======================
    // 💾 SAVE
    // =======================

    const restored = await this.collectionRepo.update(collection);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: restored.id,

      name: restored.name,

      slug: restored.slug,

      status: restored.status,

      updatedAt: restored.updatedAt,
    };
  }
}

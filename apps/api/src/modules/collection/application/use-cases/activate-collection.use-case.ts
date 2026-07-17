// src/modules/collection/application/use-cases/activate-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

@Injectable()
export class ActivateCollectionUseCase {
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
      collection: await this.collectionRepo.findById(input.collectionId),

      collectionId: input.collectionId,
    });

    // =======================
    // 🟢 ACTIVATE
    // =======================

    collection.activate();

    // =======================
    // 💾 SAVE
    // =======================

    const updated = await this.collectionRepo.update(collection);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      name: updated.name,

      slug: updated.slug,

      status: updated.status,

      updatedAt: updated.updatedAt,
    };
  }
}

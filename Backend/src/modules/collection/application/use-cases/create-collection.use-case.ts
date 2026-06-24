// src/modules/collection/application/use-cases/create-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { Collection } from '../../domain/entities/collection.entity';

import { CollectionStatus } from '../../domain/enums/collection-status.enum';

import { CollectionAlreadyExistsException } from '../../domain/exceptions/collection-already-exists.exception';
import { CollectionDomainService } from '../../domain/services/collection-domain.service';

@Injectable()
export class CreateCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    private readonly collectionDomainService: CollectionDomainService,
  ) {}

  async execute(input: {
  name: string;

  imageUrl?: string;

  description?: string;

  metaDescription?: string;
}){
    // =======================
// 🔗 SLUG
// =======================

const slug =
  this.collectionDomainService.generateSlug(
    input.name,
  );

  // =======================
// 📝 META
// =======================

const metaDescription =
  input.metaDescription?.trim() ??
  input.description?.trim();


    // =======================
    // 🔍 INCLUDING DELETED
    // =======================

    const existingByName = await this.collectionRepo.findByNameIncludingDeleted(input.name);

    const existingBySlug =
  await this.collectionRepo.findBySlugIncludingDeleted(
    slug,
  );

    // =======================
    // ♻️ RESTORE
    // =======================

    const deletedCollection = existingByName?.isDeleted()
      ? existingByName
      : existingBySlug?.isDeleted()
        ? existingBySlug
        : null;



    if (deletedCollection) {
      deletedCollection.restore();

      deletedCollection.name = input.name;

      deletedCollection.slug = slug;

      deletedCollection.imageUrl = input.imageUrl;

      deletedCollection.description = input.description;

      deletedCollection.metaDescription = metaDescription;

      deletedCollection.status = CollectionStatus.ACTIVE;

      const restored = await this.collectionRepo.update(deletedCollection);

      return {
        id: restored.id,

        name: restored.name,

        slug: restored.slug,

        imageUrl: restored.imageUrl ?? null,

        description: restored.description ?? null,

        metaDescription: restored.metaDescription ?? null,

        status: restored.status,

        createdAt: restored.createdAt,

        updatedAt: restored.updatedAt,
      };
    }

    // =======================
    // 🚫 NAME EXISTS
    // =======================

    if (existingByName && !existingByName.isDeleted()) {
      throw new CollectionAlreadyExistsException({
        name: input.name,
      });
    }

    // =======================
    // 🚫 SLUG EXISTS
    // =======================

    if (existingBySlug && !existingBySlug.isDeleted()) {
      throw new CollectionAlreadyExistsException({
        slug,
      });
    }

    // =======================
    // 🆕 CREATE
    // =======================

    const collection = new Collection(
      crypto.randomUUID(),

      input.name,

      slug,

      input.imageUrl,

      input.description,

      metaDescription,

      CollectionStatus.ACTIVE,
    );

    // =======================
    // 💾 SAVE
    // =======================

    const created = await this.collectionRepo.create(collection);

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: created.id,

      name: created.name,

      slug: created.slug,

      imageUrl: created.imageUrl ?? null,

      description: created.description ?? null,

      metaDescription: created.metaDescription ?? null,

      status: created.status,

      createdAt: created.createdAt,

      updatedAt: created.updatedAt,
    };
  }
}

// src/modules/collection/application/use-cases/update-collection.use-case.ts

import { Inject, Injectable } from '@nestjs/common';

import { TOKENS } from '@/common/constants/tokens';

import { CollectionRepository } from '../../domain/repositories/collection.repository';

import { CollectionDomainService } from '../../domain/services/collection-domain.service';

import { CollectionAlreadyExistsException } from '../../domain/exceptions/collection-already-exists.exception';

@Injectable()
export class UpdateCollectionUseCase {
  constructor(
    @Inject(TOKENS.COLLECTION_REPO)
    private readonly collectionRepo: CollectionRepository,

    private readonly domainService: CollectionDomainService,
  ) {}

  async execute(input: {
    collectionId: string;

    name?: string;

    slug?: string;

    imageUrl?: string;

    description?: string;

    metaDescription?: string;
  }) {
    // =======================
    // 🔍 COLLECTION
    // =======================

    const collection =
  this.domainService.ensureExists({
    collection:
      await this.collectionRepo.findById(
        input.collectionId,
      ),

    collectionId:
      input.collectionId,
  });
    // =======================
// 🔍 NAME CONFLICT
// =======================

if (
  input.name &&
  input.name !== collection.name
) {
  const existing =
    await this.collectionRepo.findByNameIncludingDeleted(
      input.name,
    );

  if (
    existing &&
    existing.id !== collection.id &&
    !existing.isDeleted()
  ) {
    throw new CollectionAlreadyExistsException({
      name: input.name,
    });
  }

  collection.name = input.name;

  // =======================
  // 🔗 AUTO SLUG
  // =======================

  const generatedSlug =
    this.domainService.generateSlug(
      input.name,
    );

  const slugExists =
    await this.collectionRepo.findBySlugIncludingDeleted(
      generatedSlug,
    );

  if (
    slugExists &&
    slugExists.id !== collection.id &&
    !slugExists.isDeleted()
  ) {
    throw new CollectionAlreadyExistsException({
      slug: generatedSlug,
    });
  }

  collection.slug =
    generatedSlug;
}
    // =======================
    // 🔍 SLUG CONFLICT
    // =======================

    if (
      input.slug &&
      input.slug !== collection.slug
    ) {
      const existing =
        await this.collectionRepo.findBySlugIncludingDeleted(
          input.slug,
        );

      if (
        existing &&
        existing.id !== collection.id &&
        !existing.isDeleted()
      ) {
        throw new CollectionAlreadyExistsException({
          slug: input.slug,
        });
      }

      collection.slug = input.slug;
    }

    // =======================
    // 📝 UPDATE
    // =======================

    if (input.imageUrl !== undefined) {
      collection.imageUrl =
        input.imageUrl;
    }

    // =======================
// 📝 DESCRIPTION
// =======================

if (
  input.description !== undefined
) {
  collection.description =
    input.description;

  // auto meta only if not provided
  if (
    input.metaDescription ===
    undefined
  ) {
    collection.metaDescription =
      input.description;
  }
}

// =======================
// 📝 META
// =======================

if (
  input.metaDescription !==
  undefined
) {
  collection.metaDescription =
    input.metaDescription;
}

    // =======================
    // 💾 SAVE
    // =======================

    const updated =
      await this.collectionRepo.update(
        collection,
      );

    // =======================
    // 🚀 RESPONSE
    // =======================

    return {
      id: updated.id,

      name: updated.name,

      slug: updated.slug,

      imageUrl:
        updated.imageUrl ?? null,

      description:
        updated.description ?? null,

      metaDescription:
        updated.metaDescription ?? null,

      status: updated.status,

      createdAt:
        updated.createdAt,

      updatedAt:
        updated.updatedAt,
    };
  }
}
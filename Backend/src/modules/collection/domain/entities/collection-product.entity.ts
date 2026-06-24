// src/modules/collection/domain/entities/collection-product.entity.ts

export class CollectionProduct {
  constructor(
    public readonly id: string,

    public collectionId: string,

    public productId: string,

    public sortOrder: number = 0,

    public readonly createdAt: Date = new Date(),
  ) {}
}
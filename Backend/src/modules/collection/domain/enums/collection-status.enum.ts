// src/modules/collection/domain/enums/collection-status.enum.ts

export enum CollectionStatus {
  ACTIVE = 'ACTIVE',

  INACTIVE = 'INACTIVE',
}

// 🔥 Useful helpers

export const COLLECTION_STATUS_VALUES =
  Object.values(CollectionStatus);

export type CollectionStatusType =
  (typeof COLLECTION_STATUS_VALUES)[number];

// Optional: type guard

export const isCollectionStatus = (
  value: string,
): value is CollectionStatus => {
  return COLLECTION_STATUS_VALUES.includes(
    value as CollectionStatus,
  );
};
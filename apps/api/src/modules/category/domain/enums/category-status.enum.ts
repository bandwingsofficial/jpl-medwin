export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// 🔥 Useful helpers

export const CATEGORY_STATUS_VALUES = Object.values(CategoryStatus);

export type CategoryStatusType = (typeof CATEGORY_STATUS_VALUES)[number];

// Optional: type guard (very useful in validation)
export const isCategoryStatus = (value: string): value is CategoryStatus => {
  return CATEGORY_STATUS_VALUES.includes(value as CategoryStatus);
};

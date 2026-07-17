export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const PRODUCT_STATUS_VALUES = Object.values(ProductStatus);

export type ProductStatusType = (typeof PRODUCT_STATUS_VALUES)[number];

export const isProductStatus = (value: string): value is ProductStatus => {
  return PRODUCT_STATUS_VALUES.includes(value as ProductStatus);
};

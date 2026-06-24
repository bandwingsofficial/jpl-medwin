export enum ProductType {
  SIMPLE = 'SIMPLE',
  VARIABLE = 'VARIABLE',
}

export const PRODUCT_TYPE_VALUES = Object.values(ProductType);

export type ProductTypeType = (typeof PRODUCT_TYPE_VALUES)[number];

export const isProductType = (value: string): value is ProductType => {
  return PRODUCT_TYPE_VALUES.includes(value as ProductType);
};

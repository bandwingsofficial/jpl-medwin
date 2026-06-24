export enum ImageOwnerType {
  PRODUCT = 'PRODUCT',
  VARIANT = 'VARIANT',
}

export const IMAGE_OWNER_TYPE_VALUES = Object.values(ImageOwnerType);

export type ImageOwnerTypeType = (typeof IMAGE_OWNER_TYPE_VALUES)[number];

export const isImageOwnerType = (value: string): value is ImageOwnerType => {
  return IMAGE_OWNER_TYPE_VALUES.includes(value as ImageOwnerType);
};

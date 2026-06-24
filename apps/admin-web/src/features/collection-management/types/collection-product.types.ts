export interface CollectionProductBrand {
  id: string;
  name: string;
}

export interface CollectionProductCategory {
  id: string;
  name: string;
}

export interface CollectionProductSubCategory {
  id: string;
  name: string;
}

export interface CollectionProductMiniCategory {
  id: string;
  name: string;
}

export interface CollectionProductPrice {
  min: number;
  max: number;
}

export interface CollectionProductImages {
  main: string;
  gallery: string[];
}

export interface CollectionDetailProduct {
  id: string;

  name: string;

  slug: string;

  brand: CollectionProductBrand;

  category: CollectionProductCategory;

  subCategory: CollectionProductSubCategory;

  miniCategory: CollectionProductMiniCategory;

  shortDescription: string;

  longDescription: string;

  status: string;

  currency: string;

  inStock: boolean;

  price: CollectionProductPrice;

  images: CollectionProductImages;
}
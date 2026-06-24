export type VariantDTO = {
  id: string;
  sku: string;
  name: string;
  slug: string;

  sellingPrice: number;
  mrp: number;
  purchasePrice: number;

  quantity: number;
  stockStatus: string;

  attributes: any;

  mainImage: string | null;

  status: string;

  // 🔥 ADD THIS
  images: ImageDTO[];
};

export type ImageDTO = {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
};

export type ProductDetailDTO = {
  id: string;
  name: string;
  slug: string;

  mainImage: string | null;

  status: string;

  shortDescription?: string | null;
  longDescription?: string | null;

  features: string[];
  tags: string[];
  displayNotes: string[];

  specifications: any;

  averageRating: number;
  reviewCount: number;

  variants: VariantDTO[];
  images: ImageDTO[];
};

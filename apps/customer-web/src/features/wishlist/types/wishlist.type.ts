import { Product } from "@/features/products/types/product.type";
import { ProductVariant } from "@/features/products/types/product.type";

export interface WishlistProduct {
  ratings: any;
  tags: any;
  features: any;
  descriptions: any;

  id: string;
  name: string;
  slug: string;

  shortDescription: string | null;

  brand: {
    id: string;
    name: string;
  } | null;

  category: {
    main: string | null;
    sub: string | null;
    mini: string | null;
  };

  pricing: {
    minPrice: number | null;
    maxPrice: number | null;
    currency: string;
  };

  rating: {
    averageRating: number;
    reviewCount: number;
  };

  image: {
    main: string | null;
  };

  status: string;

  defaultVariantId: string | null;

  variants: ProductVariant[];
}

export interface WishlistItem {
  wishlistId: string;
  product: WishlistProduct;
  addedAt: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  items: WishlistItem[];
  totalItems: number;
}

/*
 * Backend GET /wishlist response
 *
 * Backend returns the product directly inside items[].
 */
export interface WishlistApiItem extends Product {
  wishlist: {
    id: string;
    addedAt: string;
  };
}

export interface WishlistApiResponse {
  success: boolean;
  message: string;
  items: WishlistApiItem[];
  totalItems: number;
}

export interface WishlistCountResponse {
  success: boolean;
  message: string;
  count: number;
}
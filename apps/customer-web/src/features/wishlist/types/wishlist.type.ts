// src/features/wishlist/types/wishlist.type.ts
import {
  Product,
} from "@/features/products/types/product.type";


export interface WishlistProduct {
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
}

export interface WishlistItem {
  wishlistId: string;

  product: WishlistProduct;

  addedAt: string;
}

export interface WishlistItem
  extends Product {
  wishlist: {
    id: string;

    addedAt: string;
  };
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  items: WishlistItem[];
  totalItems: number;
}

export interface WishlistCountResponse {
  success: boolean;
  message: string;
  count: number;
}
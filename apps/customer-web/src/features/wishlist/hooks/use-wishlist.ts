"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { wishlistApi } from "../api/wishlist.api";
import { localWishlistService } from "../hooks/local-wishlist.service";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { Product } from "@/features/products/types/product.type";
import { WishlistProduct } from "../types/wishlist.type";

const mapProductToWishlistProduct = (
  product: Product & {
    shortDescription?: string;
    longDescription?: string;
    category?: {
      id?: string;
      name?: string;
      slug?: string;
      main?: string;
      sub?: string;
      mini?: string;
    };
    subCategory?: {
      id?: string;
      name?: string;
      slug?: string;
    };
    miniCategory?: {
      id?: string;
      name?: string;
      slug?: string;
    };
  }
): WishlistProduct => ({
  id: product.id,

  name: product.name,

  slug: product.slug,

  shortDescription:
    product.shortDescription ??
    product.descriptions?.short ??
    null,

  brand: product.brand
    ? {
        id: product.brand.id,
        name: product.brand.name ?? "",
      }
    : null,

  category: {
    main:
      product.category?.name ??
      product.category?.main ??
      null,

    sub:
      product.subCategory?.name ??
      product.category?.sub ??
      null,

    mini:
      product.miniCategory?.name ??
      product.category?.mini ??
      null,
  },

  pricing: {
    minPrice: product.price?.min ?? null,
    maxPrice: product.price?.max ?? null,
    currency: "INR",
  },

  rating: {
    averageRating: product.ratings?.average ?? 0,
    reviewCount: product.ratings?.count ?? 0,
  },

  image: {
    main: product.images?.main ?? null,
  },

  status: product.status,

  // REQUIRED FIELDS
  ratings: product.ratings ?? {
    average: 0,
    count: 0,
  },

  tags: product.tags ?? [],

  features: product.features ?? [],

  descriptions:
    product.descriptions ?? {
      short: product.shortDescription ?? "",
      long: product.longDescription ?? "",
    },

  defaultVariantId:
    product.defaultVariantId ?? null,

  variants: product.variants ?? [],
});

export const useWishlist = () => {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["wishlist"],

    queryFn: async () => {
      if (isAuthenticated) {
        const response =
          await wishlistApi.getWishlist();

        return {
          success: response.success,
          message: response.message,

          items: response.items.map(
            (item) => ({
              wishlistId: item.wishlist.id,

              product:
                mapProductToWishlistProduct(
                  item
                ),

              addedAt:
                item.wishlist.addedAt,
            })
          ),

          totalItems:
            response.totalItems,
        };
      }

      const products =
        localWishlistService.getAll();

      return {
        success: true,
        message: "Guest wishlist",

        items: products.map(
          (product) => ({
            wishlistId: product.id,

            product:
              mapProductToWishlistProduct(
                product
              ),

            addedAt:
              new Date().toISOString(),
          })
        ),

        totalItems:
          products.length,
      };
    },

    enabled:
      isAuthenticated !== undefined,

    staleTime: 0,

    retry: 1,

    refetchOnWindowFocus: true,

    refetchOnMount: true,
  });

  const wishlistIds = useMemo(() => {
    const items =
      query.data?.items ?? [];

    return new Set(
      items
        .map(
          (item) =>
            item?.product?.id
        )
        .filter(
          (id): id is string =>
            typeof id === "string" &&
            id.length > 0
        )
    );
  }, [query.data?.items]);

  return {
    ...query,
    wishlistIds,
  };
};
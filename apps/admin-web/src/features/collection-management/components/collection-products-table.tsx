"use client";

import { useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";

import {
  CollectionDetailProduct,
} from "@/features/collection-management/types/collection-product.types";

interface Props {
  products: CollectionDetailProduct[];

  isLoading: boolean;

  onRemoveProduct: (
    product: CollectionDetailProduct
  ) => void;
}

export function CollectionProductsTable({
  products,
  isLoading,
  onRemoveProduct,
}: Props) {
  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  if (isLoading) {
    return <Loader />;
  }

  if (!products.length) {
    return (
      <EmptyState title="No products assigned to this collection" />
    );
  }

  const totalPages = Math.ceil(
    products.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedProducts =
    products.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-5 py-3 text-left">
              Product
            </th>

            <th className="px-5 py-3 text-left">
              Brand
            </th>

            <th className="px-5 py-3 text-left">
              Category
            </th>

            <th className="px-5 py-3 text-left">
              Status
            </th>

            <th className="px-5 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {paginatedProducts.map(
            (product) => (
              <tr
                key={product.id}
                className="border-b"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images.main}
                      alt={
                        product.name
                      }
                      className="w-12 h-12 rounded-md object-cover"
                    />

                    <div>
                      <p className="font-medium">
                        {
                          product.name
                        }
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {
                          product.slug
                        }
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-3">
                  {
                    product.brand
                      .name
                  }
                </td>

                <td className="px-5 py-3">
                  {
                    product.category
                      .name
                  }
                </td>

              

                <td className="px-5 py-3">
                  {product.status}
                </td>

                <td className="px-5 py-3">
                  <div className="flex justify-end">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() =>
                        onRemoveProduct(
                          product
                        )
                      }
                    >
                      <Trash2
                        size={14}
                      />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t">
          <span className="text-xs text-muted-foreground">
            Showing{" "}
            {startIndex + 1}
            {" - "}
            {Math.min(
              startIndex +
                itemsPerPage,
              products.length
            )}
          </span>

          <div className="flex gap-2">
            <Button
              size="icon"
              disabled={
                currentPage === 1
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev - 1
                )
              }
            >
              <ChevronLeft
                size={14}
              />
            </Button>

            <Button
              size="icon"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() =>
                setCurrentPage(
                  (prev) =>
                    prev + 1
                )
              }
            >
              <ChevronRight
                size={14}
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
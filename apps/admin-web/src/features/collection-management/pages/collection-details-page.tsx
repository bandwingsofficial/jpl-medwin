"use client";

import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Loader } from "@/shared/components/ui/loader";
import { EmptyState } from "@/shared/components/ui/empty-state";

import {
  showConfirmToast,
  showError,
  showSuccess,
} from "@/shared/store/toast.store";

import {
  useCollection,
  useRemoveProduct,
} from "@/features/collection-management/hooks/use-collections";

import {
  CollectionDetailsCard,
} from "@/features/collection-management/components/collection-details-card";

import {
  CollectionProductsTable,
} from "@/features/collection-management/components/collection-products-table";

import {
  AssignProductModal,
} from "@/features/collection-management/components/assign-product-modal";

import {
  CollectionDetailProduct,
} from "@/features/collection-management/types/collection-product.types";

interface Props {
  collectionId: string;
}

export function CollectionDetailsPage({
  collectionId,
}: Props) {
  const {
    data,
    isLoading,
    isError,
  } = useCollection(
    collectionId
  );

  const removeProduct =
    useRemoveProduct();

  const [
    assignOpen,
    setAssignOpen,
  ] = useState(false);

  async function handleRemoveProduct(
    product: CollectionDetailProduct
  ) {
    showConfirmToast(
      `Remove "${product.name}" from collection ?`,

      async () => {
        try {
          await removeProduct.mutateAsync({
            collectionId,
            productId:
              product.id,
          });

          showSuccess(
            "Product removed successfully"
          );
        } catch (
          error: any
        ) {
          showError(
            error?.message ||
              "Failed to remove product"
          );
        }
      }
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (
    isError ||
    !data
  ) {
    return (
      <EmptyState
        title="Collection not found"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div
        className="
          flex
          items-center
          justify-between
        "
      >
        <div>
          <h1
            className="
              animate-text-shine
              bg-gradient-to-r
              from-[#001f3f]
              via-[#0d9488]
              to-[#001f3f]
              bg-clip-text
              text-[28px]
              font-bold
              text-transparent
            "
          >
            Collection Details
          </h1>

          <p
            className="
              mt-1
              text-sm
              text-gray-500
            "
          >
            Manage assigned products
          </p>
        </div>

        <Button
          onClick={() =>
            setAssignOpen(
              true
            )
          }
        >
          + Assign Product
        </Button>
      </div>

      {/* DETAILS */}

      <CollectionDetailsCard
        collection={
          data.collection
        }
        productCount={
          data.products.length
        }
      />

      {/* PRODUCTS */}

      <CollectionProductsTable
        products={
          data.products
        }
        isLoading={false}
        onRemoveProduct={
          handleRemoveProduct
        }
      />

      {/* ASSIGN */}

      <AssignProductModal
        open={assignOpen}
        collectionId={
          collectionId
        }
        onClose={() =>
          setAssignOpen(
            false
          )
        }
      />
    </div>
  );
}
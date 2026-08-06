"use client";

import { useState } from "react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";

import {
  useProduct,
} from "@/features/product-management/hooks/use-product";

interface Props {
  isSubmitting: boolean;

  defaultProductId?: string;

  defaultSortOrder?: number;

  onSubmit: (
    file: File | undefined,
    productId: string,
    sortOrder: number
  ) => Promise<void>;
}

export function BannerImageForm({
  isSubmitting,
  defaultProductId = "",
  defaultSortOrder = 0,
  onSubmit,
}: Props) {
  const [file, setFile] =
    useState<File>();

  const [
    productId,
    setProductId,
  ] = useState(
    defaultProductId
  );

  const [
    sortOrder,
    setSortOrder,
  ] = useState(
    defaultSortOrder
  );

  // PRODUCTS

  const {
    productsQuery,
  } = useProduct();

  const products =
    productsQuery.data?.data ?? [];

  return (
    <form
      className="space-y-5"
      onSubmit={async (
        event
      ) => {
        event.preventDefault();

        // Prevent submission if file or product ID is missing
        if (!file || !productId) {
          return;
        }

        await onSubmit(
          file,
          productId,
          sortOrder
        );
      }}
    >
      {/* IMAGE */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Image <span className="text-destructive text-red-500">*</span>
        </label>

        <Input
          type="file"
          accept="image/*"
          onChange={(
            event
          ) => {
            const selectedFile =
              event.target
                .files?.[0];

            if (
              selectedFile
            ) {
              setFile(
                selectedFile
              );
            }
          }}
        />
      </div>

      {/* PRODUCT */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Product <span className="text-destructive text-red-500">*</span>
        </label>

        <Select
          value={productId}
          onChange={(
            event
          ) =>
            setProductId(
              event.target
                .value
            )
          }
        >
          <option value="">
            Select Product
          </option>

          {products.map(
            (
              product
            ) => (
              <option
                key={
                  product.id
                }
                value={
                  product.id
                }
              >
                {
                  product.name
                }
              </option>
            )
          )}
        </Select>
      </div>

      {/* SORT ORDER */}

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Sort Order
        </label>

        <Input
          type="number"
          value={sortOrder}
          onChange={(
            event
          ) =>
            setSortOrder(
              Number(
                event.target
                  .value
              )
            )
          }
        />
      </div>

      {/* SUBMIT */}

      <Button
        type="submit"
        loading={
          isSubmitting
        }
        className="w-full"
        disabled={!file || !productId || isSubmitting}
      >
        Save Image
      </Button>
    </form>
  );
}
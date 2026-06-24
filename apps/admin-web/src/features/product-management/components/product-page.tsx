"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { ProductTable } from "./product-table";
import { CreateProductModal } from "./create-product-modal";
import { ImportProductsModal } from "./import-products-modal";
import { useProductExport } from "../hooks/use-product-export";
import { useProduct } from "../hooks/use-product";
import { Download } from "lucide-react";

export function ProductPage() {
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const { productsQuery } = useProduct();

  const {
    data: responseBody,
    isLoading,
  } = productsQuery;

  const totalProductsCount =
    responseBody?.pagination?.total ??
    responseBody?.data?.length ??
    0;

  const { exportProducts } =
    useProductExport();

  return (
    <div className="space-y-6">
      {/* HEADER ACTION SECTION */}
      <div className="flex p-0 items-start justify-between gap-4">
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
              tracking-tight
            "
          >
            Products
          </h1>

          <p
            className="
              mt-1
              text-sm
              font-semibold
              text-teal-600
            "
          >
            Total Products Available:{" "}
            {isLoading
              ? "..."
              : totalProductsCount}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* EXPORT EXCEL BUTTON */}
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={exportProducts}
            className="
      inline-flex
      shrink-0
      items-center
      gap-2
      rounded-lg
      bg-teal-600
      px-4
      py-2.5
      text-sm
      font-medium
      text-white
      transition
      hover:bg-teal-700
    "
          > <Download size={16} />
            Export Excel
          </Button>

          {/* IMPORT EXCEL BUTTON */}
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={() =>
              setImportOpen(true)
            }
            className="
              h-10
              px-4
              rounded-xl
              bg-teal-600
              text-white
              hover:bg-teal-700
              transition-all
              font-medium
              text-sm
              shadow-sm
              shadow-teal-600/10
            "
          >
            Import Excel
          </Button>

          {/* ADD PRODUCT BUTTON */}
          <Button
            disabled={isLoading}
            onClick={() => setOpen(true)}
            className="
              h-10
              px-4
              rounded-xl
              bg-teal-600
              text-white
              hover:bg-teal-700
              transition-all
              font-medium
              text-sm
              shadow-sm
              shadow-teal-600/10
            "
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* PRODUCT DATA TABLE VIEW CONTAINER */}
      <ProductTable />

      {/* DATA MANIPULATION LAYER: MODALS */}
      <CreateProductModal
        open={open}
        onClose={() =>
          setOpen(false)
        }
      />

      <ImportProductsModal
        open={importOpen}
        onClose={() =>
          setImportOpen(false)
        }
      />
    </div>
  );
}
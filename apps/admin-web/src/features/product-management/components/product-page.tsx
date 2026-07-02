"use client";

import { useState } from "react";

import { Download } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { ProductTable } from "./product-table";

import { CreateProductModal } from "./create-product-modal";

import { ImportProductsModal } from "./import-products-modal";

import ExportProductsDialog from "./export-products-dialog";

import { useProduct } from "../hooks/use-product";

export function ProductPage() {
  const [open, setOpen] =
    useState(false);

  const [
    importOpen,
    setImportOpen,
  ] = useState(false);

  const [
    exportOpen,
    setExportOpen,
  ] = useState(false);

  const { productsQuery } =
    useProduct();

  const {
    data: responseBody,
    isLoading,
  } = productsQuery;

  const totalProductsCount =
    responseBody?.pagination
      ?.total ??
    responseBody?.data?.length ??
    0;

  return (
    <div className="space-y-6">
      {/* HEADER ACTION SECTION */}

      <div className="flex items-start justify-between gap-4 p-0">
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
              tracking-tight
              text-transparent
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
            Total Products
            Available:{" "}
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
            onClick={() =>
              setExportOpen(true)
            }
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
          >
            <Download size={16} />
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
              rounded-xl
              bg-teal-600
              px-4
              text-sm
              font-medium
              text-white
              shadow-sm
              shadow-teal-600/10
              transition-all
              hover:bg-teal-700
            "
          >
            Import Excel
          </Button>

          {/* ADD PRODUCT BUTTON */}

          <Button
            disabled={isLoading}
            onClick={() =>
              setOpen(true)
            }
            className="
              h-10
              rounded-xl
              bg-teal-600
              px-4
              text-sm
              font-medium
              text-white
              shadow-sm
              shadow-teal-600/10
              transition-all
              hover:bg-teal-700
            "
          >
            + Add Product
          </Button>
        </div>
      </div>

      {/* PRODUCT TABLE */}

      <ProductTable />

      {/* MODALS */}

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

      <ExportProductsDialog
        open={exportOpen}
        onClose={() =>
          setExportOpen(false)
        }
      />
    </div>
  );
}
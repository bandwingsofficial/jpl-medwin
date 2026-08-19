"use client";

import { useState } from "react";

import { Download,  Home,
  ChevronRight,
  Upload,} from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ProductPageSkeleton } from "./product-page-skeleton";
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

    if (isLoading) {
  return <ProductPageSkeleton />;
}

  return (
  <div className="space-y-6">

    {/* BREADCRUMBS */}

    <div className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="
          inline-flex
          items-center
          gap-1.5
          font-medium
          text-slate-500
          transition-colors
          hover:text-teal-600
        "
      >
        <Home className="h-4 w-4" />
        Home
      </Link>

      <ChevronRight
        className="h-4 w-4 text-slate-300"
        strokeWidth={2}
      />

      <span className="font-semibold text-teal-600">
        Products
      </span>
    </div>

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
  {/* EXPORT EXCEL */}
  <Button
    variant="ghost"
    disabled={isLoading}
    onClick={() => setExportOpen(true)}
    className="
      group
      h-10
      shrink-0
      gap-2
      rounded-xl
      border
      border-teal-200/80
      bg-white/60
      px-4
      text-sm
      font-semibold
      text-teal-700
      shadow-[0_4px_20px_rgba(13,148,136,0.08)]
      backdrop-blur-xl
      transition-all
      duration-200
      hover:-translate-y-[1px]
      hover:border-teal-300
      hover:bg-teal-50/80
      hover:text-teal-800
      hover:shadow-[0_8px_24px_rgba(13,148,136,0.14)]
      disabled:pointer-events-none
      disabled:opacity-50
    "
  >
    <Download
      size={16}
      strokeWidth={2.2}
      className="
        transition-transform
        duration-200
        group-hover:-translate-y-0.5
      "
    />

    <span>Export Excel</span>
  </Button>

  {/* IMPORT EXCEL */}
  <Button
    variant="ghost"
    disabled={isLoading}
    onClick={() => setImportOpen(true)}
    className="
      group
      h-10
      shrink-0
      gap-2
      rounded-xl
      border
      border-teal-200/80
      bg-white/60
      px-4
      text-sm
      font-semibold
      text-teal-700
      shadow-[0_4px_20px_rgba(13,148,136,0.08)]
      backdrop-blur-xl
      transition-all
      duration-200
      hover:-translate-y-[1px]
      hover:border-teal-300
      hover:bg-teal-50/80
      hover:text-teal-800
      hover:shadow-[0_8px_24px_rgba(13,148,136,0.14)]
      disabled:pointer-events-none
      disabled:opacity-50
    "
  >
    <Upload
      size={16}
      strokeWidth={2.2}
      className="
        transition-transform
        duration-200
        group-hover:-translate-y-0.5
      "
    />

    <span>Import Excel</span>
  </Button>

  {/* ADD PRODUCT */}
  <Button
    disabled={isLoading}
    onClick={() => setOpen(true)}
    className="
      h-10
      rounded-xl
      bg-teal-600
      px-4
      text-sm
      font-semibold
      text-white
      shadow-[0_6px_20px_rgba(13,148,136,0.22)]
      transition-all
      duration-200
      hover:-translate-y-[1px]
      hover:bg-teal-700
      hover:shadow-[0_8px_24px_rgba(13,148,136,0.28)]
      disabled:pointer-events-none
      disabled:opacity-50
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
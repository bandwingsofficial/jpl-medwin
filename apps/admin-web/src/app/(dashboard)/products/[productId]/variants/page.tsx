import Link from "next/link";

import { ProductVariantPage } from "@/features/product-management/components/product-variant-page";

import {
  ChevronRight,
  Home,
} from "lucide-react";

// =========================================
// TYPES
// =========================================

interface VariantsPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// =========================================
// PAGE
// =========================================

export default async function VariantsPage(
  props: VariantsPageProps
) {
  const params =
    await props.params;

  const {
    productId,
  } = params;

  // =========================================
  // VALIDATION
  // =========================================

  if (!productId) {
    return (
      <div className="p-6 text-sm text-red-500">
        Invalid Product ID
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="space-y-6">

      {/* ========================================= */}
      {/* BREADCRUMB */}
      {/* ========================================= */}

      <div className="flex items-center gap-2 text-sm">

        {/* HOME */}

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

        {/* CHEVRON */}

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        {/* PRODUCTS */}

        <Link
          href="/products"
          className="
            font-medium
            text-slate-500
            transition-colors
            hover:text-teal-600
          "
        >
          Products
        </Link>

        {/* CHEVRON */}

        <ChevronRight
          className="h-4 w-4 text-slate-300"
          strokeWidth={2}
        />

        {/* CURRENT PAGE */}

        <span className="font-semibold text-teal-600">
          Variants
        </span>

      </div>

      {/* ========================================= */}
      {/* PRODUCT VARIANTS */}
      {/* ========================================= */}

      <ProductVariantPage
        key={productId}
        productId={productId}
      />

    </div>
  );
}
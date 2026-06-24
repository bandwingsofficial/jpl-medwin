import {
  VariantDetailsPage,
} from "@/features/product-management/components/variant-details-page";

// =========================================
// TYPES
// =========================================

interface VariantDetailsRoutePageProps {
  params: Promise<{
    productId: string;
    variantId: string;
  }>;
}

// =========================================
// PAGE
// =========================================

export default async function VariantDetailsRoutePage(
  props: VariantDetailsRoutePageProps
) {
  const params =
    await props.params;

  const {
    productId,
    variantId,
  } = params;

  // =========================================
  // VALIDATION
  // =========================================

  if (
    !productId ||
    !variantId
  ) {
    return (
      <div className="p-6 text-sm text-red-500">
        Invalid Variant Details Request
      </div>
    );
  }

  // =========================================
  // RENDER
  // =========================================

  return (
    <VariantDetailsPage
      key={`${productId}-${variantId}`}
      productId={productId}
      variantId={variantId}
    />
  );
}